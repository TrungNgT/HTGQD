import { Builder, By, until } from 'selenium-webdriver';
import fs from 'fs';
import chrome from 'selenium-webdriver/chrome';

(async function scrape() {
    // Cấu hình Chrome để sử dụng profile đã đăng nhập
    // const options = new chrome.Options();
    
    // // Đường dẫn đến thư mục profile của Chrome
    // const userDataDir = '~/.config/google-chrome/Default'; // Thay bằng đường dẫn chính xác tới thư mục profile Chrome của bạn
    // options.addArguments(`--user-data-dir=${userDataDir}`);

    // // Khởi tạo WebDriver (sử dụng trình duyệt Chrome với profile đã đăng nhập)
     const driver = await new Builder().forBrowser('chrome').build();

    try {
        // Truy cập vào trang web cần đăng nhập
        const url = 'https://qldt.hust.edu.vn/#danh-sach-de-tai';
        await driver.get(url);

        // Chờ nút đăng nhập xuất hiện và nhấn vào đó
        await driver.wait(until.elementLocated(By.className('btn-login-main-style')), 20000);
        const loginButton = await driver.findElement(By.className('btn-login-main-style'));
        await loginButton.click();

        await driver.wait(until.elementLocated(By.className('LEB')), 20000);
        const leButton = await driver.findElement(By.className('LEB'));
        await leButton.click();

        // Chờ cho popup đăng nhập xuất hiện và nhập email
        await driver.wait(until.elementLocated(By.css('input[type="email"]')), 20000);
        const emailInput = await driver.findElement(By.css('input[type="email"]'));
        const email = 'viet.bd215513@sis.hust.edu.vn'; // Thay bằng email của bạn
        await emailInput.sendKeys(email);

        // Nhấn vào nút tiếp theo
        const nextButton = await driver.findElement(By.className('win-button'));
        await nextButton.click();

        // Chờ cho trang mật khẩu xuất hiện và nhập mật khẩu
        await driver.wait(until.elementLocated(By.id('passwordInput')), 10000);
        const passwordInput = await driver.findElement(By.id('passwordInput'));
        const password = 'vietthptqt10a'; // Thay bằng mật khẩu của bạn
        await passwordInput.sendKeys(password);

        // Nhấn nút Đăng nhập
        const submitButton = await driver.findElement(By.id('submitButton'));
        await submitButton.click();
        

        // Chờ và tìm input có type là 'submit' để nhấn tiếp
        await driver.wait(until.elementLocated(By.css('input[type="submit"]')), 50000);
        const submitInput = await driver.findElement(By.css('input[type="submit"]'));
        await submitInput.click();
        // Chờ cho trang sau khi đăng nhập thành công tải xong
        await driver.wait(until.elementLocated(By.css('tr.even')), 100000);

        // Truy cập vào trang danh sách đề tài
        //

        // Tìm tất cả các hàng
        const rows = await driver.findElements(By.css('tbody:not([style*="display: none"]) tr'));


        // Duyệt qua từng hàng và trích xuất dữ liệu
        const data = [];
        for (const row of rows) {
            try {
                // Lấy thông tin từng mục
                const sttElement = await row.findElement(By.css('td:nth-child(1) div'));
                const stt = sttElement ? await sttElement.getText() : 'Không xác định';
        
                const sinhVienKhoaElement = await row.findElement(By.css('td:nth-child(2) div'));
                const sinhVienKhoa = sinhVienKhoaElement
                    ? await sinhVienKhoaElement.getText()
                    : 'Không xác định';
                const [tenSinhVien, khoa] = sinhVienKhoa.includes('\n')
                    ? sinhVienKhoa.split('\n')
                    : ['Không xác định', 'Không xác định'];
        
                const thongTinElement = await row.findElement(By.css('td:nth-child(3) div'));
                const thongTin = thongTinElement ? await thongTinElement.getText() : 'Không xác định';
        
                const tenDeTaiElement = await row.findElement(By.css('td:nth-child(3) b'));
                const tenDeTai = tenDeTaiElement
                    ? await tenDeTaiElement.getText()
                    : 'Không xác định';
        
                // Trích xuất các mục chi tiết
                const loaiDeTaiMatch = thongTin.match(/Loại đề tài: (.+)/);
                const loaiDeTai = loaiDeTaiMatch ? loaiDeTaiMatch[1].trim() : 'Không xác định';
        
                const heMatch = thongTin.match(/Hệ: (.+)/);
                const he = heMatch ? heMatch[1].trim() : 'Không xác định';
        
                const soSVMatch = thongTin.match(/Số SV: (.+)/);
                const soSV = soSVMatch ? soSVMatch[1].trim() : 'Không xác định';
        
                // Lưu kết quả
                data.push({
                   // STT: stt.trim(),
                    'Tên giảng viên': tenSinhVien.trim(),
                    Khoa: khoa.trim(),
                    'Tên đề tài': tenDeTai.trim(),
                    'Loại đề tài': loaiDeTai,
                    Hệ: he,
                    'Số SV': soSV,
                });
            } catch (error) {
                console.error('Lỗi khi xử lý một hàng:', error.message);
            }
        }
        

        // Ghi dữ liệu vào file JSON
        const fs = require('fs');
        const fileName = 'dataDoAn2.json';
        
        // Đọc dữ liệu hiện có từ file JSON
        let existingData = [];
        if (fs.existsSync(fileName)) {
            const fileContent = fs.readFileSync(fileName, 'utf-8');
            existingData = fileContent ? JSON.parse(fileContent) : [];
        }
        
        // Kiểm tra và thêm dữ liệu mới
        const newData = data.filter(newItem => {
            return !existingData.some(existingItem => 
                //existingItem['STT'] === newItem['STT'] &&
                existingItem['Tên giảng viên'] === newItem['Tên giảng viên'] &&
                existingItem['Tên đề tài'] === newItem['Tên đề tài']
            );
        });
        
        if (newData.length > 0) {
            // Ghi thêm dữ liệu mới vào file JSON
            const updatedData = [...existingData, ...newData];
            fs.writeFileSync(fileName, JSON.stringify(updatedData, null, 2), 'utf-8');
            console.log(`Đã thêm ${newData.length} bản ghi mới vào file: ${fileName}`);
        } else {
            console.log('Không có bản ghi mới để thêm vào file.');
        }
        
        console.log(`Dữ liệu đã được lưu vào file: ${fileName}`);
    } catch (error) {
        console.error('Lỗi trong quá trình crawl:', error.message);
    } finally {
        // Đóng trình duyệt
        await driver.quit();
    }
})();
