const fs = require('fs');

// Đọc dữ liệu từ file dataDoAn.json
fs.readFile('dataDoAn.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file', err);
        return;
    }

    // Chuyển đổi chuỗi JSON thành đối tượng
    const projects = JSON.parse(data);

    // Tạo hai mảng để chứa dữ liệu phân loại
    const khoaKHMT = [];
    const khoaKTMT = [];

    // Phân loại dữ liệu theo khoa
    projects.forEach(project => {
        if (project.Khoa === "Khoa Kỹ thuật Máy tính") {
            khoaKHMT.push(project);
        } else if (project.Khoa === "Khoa Khoa học Máy tính") {
            khoaKTMT.push(project);
        }
    });

    // Ghi dữ liệu vào các file JSON tương ứng
    fs.writeFile('./dataGV/KhoaKHMT.json', JSON.stringify(khoaKHMT, null, 4), 'utf8', (err) => {
        if (err) {
            console.error('Error writing to KhoaKHMT.json', err);
        } else {
            console.log('Dữ liệu đã được ghi vào KhoaKHMT.json');
        }
    });

    fs.writeFile('./dataGV/KhoaKTMT.json', JSON.stringify(khoaKTMT, null, 4), 'utf8', (err) => {
        if (err) {
            console.error('Error writing to KhoaKTMT.json', err);
        } else {
            console.log('Dữ liệu đã được ghi vào KhoaKTMT.json');
        }
    });
});
