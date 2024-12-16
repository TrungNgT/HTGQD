const fs = require('fs');
const path = require('path');

// Đường dẫn tới file KhoaKHMT.json
const filePath = path.join(__dirname, 'public', 'KhoaKHMT.json');

// Đọc dữ liệu từ file KhoaKHMT.json
fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
        console.error('Lỗi khi đọc file:', err);
        return;
    }

    // Parse dữ liệu JSON
    let jsonData;
    try {
        jsonData = JSON.parse(data);
    } catch (parseErr) {
        console.error('Lỗi khi parse JSON:', parseErr);
        return;
    }

    // Hàm đánh lại ID tăng dần
    function reassignIds(array) {
        return array.map((item, index) => ({
            ...item,
            id: index + 1 // ID mới bắt đầu từ 1
        }));
    }

    // Gọi hàm để cập nhật ID
    const updatedData = reassignIds(jsonData);

    // Hiển thị dữ liệu mới
    console.log(updatedData);

    // Lưu dữ liệu đã cập nhật vào file
    const outputFilePath = path.join(__dirname, 'public', 'updatedData.json');
    fs.writeFile(outputFilePath, JSON.stringify(updatedData, null, 4), 'utf-8', (writeErr) => {
        if (writeErr) {
            console.error('Lỗi khi ghi file:', writeErr);
        } else {
            console.log('Dữ liệu đã được lưu vào updatedData.json');
        }
    });
});
