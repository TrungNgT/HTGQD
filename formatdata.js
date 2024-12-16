const fs = require('fs');

// Load the data from your JSON files
const khoaKHMTData = JSON.parse(fs.readFileSync('./dataGV/KhoaKHMT.json', 'utf8'));
const khoaKTMTData = JSON.parse(fs.readFileSync('./dataGV/KhoaKTMT.json', 'utf8'));

// Function to extract unique giang vien names from an array of records
const extractGiangVienNames = (data) => {
  // Create a set to ensure uniqueness
  const giangVienSet = new Set();
  data.forEach(item => {
    if (item['Tên giảng viên']) {
      giangVienSet.add(item['Tên giảng viên']);
    }
  });
  return Array.from(giangVienSet);
};

// Extract giang vien names for each khoa
const giangVienKhoaKHMT = extractGiangVienNames(khoaKHMTData);
const giangVienKhoaKTMT = extractGiangVienNames(khoaKTMTData);

// Combine the data into an object
const giangVienData = {
  'Khoa Khoa học máy tính': giangVienKhoaKHMT,
  'Khoa Kỹ thuật máy tính': giangVienKhoaKTMT,
};

// Write the final result to a new JSON file (optional)
fs.writeFileSync('GiangVienList.json', JSON.stringify(giangVienData, null, 2));

console.log('Giang Vien Data:', giangVienData);
