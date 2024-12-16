const eR = {};

eR["Không xác định"] = { "Cử nhân" : 0.5, "Kĩ sư chính quy" : 0.5, "Kĩ sư CLC": 0.5, "Kĩ sư tài năng": 0.5, "HEDSPI": 0.5, "Việt-Pháp": 0.5, "Thạc sĩ Khoa học": 0.5, "Thạc sĩ Kĩ thuật": 0.5, "Chương trình tiên tiến": 0.5};
eR["CN"] = { "Cử nhân" : 1, "Kĩ sư chính quy" : 0.6, "Kĩ sư CLC": 0.6, "Kĩ sư tài năng": 0.8, "HEDSPI": 0.9, "Việt-Pháp": 0.9, "Thạc sĩ Khoa học": 0.1, "Thạc sĩ Kĩ thuật": 0.15, "Chương trình tiên tiến": 0.9};
eR["KSCQ"] = { "Cử nhân" : 0.9, "Kĩ sư chính quy" : 1, "Kĩ sư CLC": 0.7, "Kĩ sư tài năng": 0.9, "HEDSPI": 0.9, "Việt-Pháp": 0.9, "Thạc sĩ Khoa học": 0.1, "Thạc sĩ Kĩ thuật": 0.15, "Chương trình tiên tiến": 0.9};
eR["KSCLC"] = { "Cử nhân" : 0.75, "Kĩ sư chính quy" : 0.8, "Kĩ sư CLC": 1, "Kĩ sư tài năng": 0.9, "HEDSPI": 0.8, "Việt-Pháp": 0.9, "Thạc sĩ Khoa học": 0.2, "Thạc sĩ Kĩ thuật": 0.2, "Chương trình tiên tiến": 0.9};
eR["KSTN"] = { "Cử nhân" : 0.8, "Kĩ sư chính quy" : 0.8, "Kĩ sư CLC": 0.8, "Kĩ sư tài năng": 1, "HEDSPI": 0.75, "Việt-Pháp": 0.75, "Thạc sĩ Khoa học": 0.4, "Thạc sĩ Kĩ thuật": 0.4, "Chương trình tiên tiến": 0.8};
eR["HEDSPI"] = { "Cử nhân" : 0.4, "Kĩ sư chính quy" : 0.8, "Kĩ sư CLC": 0.8, "Kĩ sư tài năng": 0.9, "HEDSPI": 1, "Việt-Pháp": 0.4, "Thạc sĩ Khoa học": 0.1, "Thạc sĩ Kĩ thuật": 0.15, "Chương trình tiên tiến": 0.6};
eR["Viet-Phap"] = { "Cử nhân" : 0.7, "Kĩ sư chính quy" : 0.8, "Kĩ sư CLC": 0.8, "Kĩ sư tài năng": 0.9, "HEDSPI": 0.7, "Việt-Pháp": 1, "Thạc sĩ Khoa học": 0.2, "Thạc sĩ Kĩ thuật": 0.25, "Chương trình tiên tiến": 0.8};
eR["ThSKH"] = { "Cử nhân" : 0.6, "Kĩ sư chính quy" : 0.6, "Kĩ sư CLC": 0.6, "Kĩ sư tài năng": 0.7, "HEDSPI": 0.6, "Việt-Pháp": 0.6, "Thạc sĩ Khoa học": 1, "Thạc sĩ Kĩ thuật": 0.75, "Chương trình tiên tiến": 0.7};
eR["THSKT"] = { "Cử nhân" : 0.6, "Kĩ sư chính quy" : 0.6, "Kĩ sư CLC": 0.6, "Kĩ sư tài năng": 0.7, "HEDSPI": 0.6, "Việt-Pháp": 0.6, "Thạc sĩ Khoa học": 0.8, "Thạc sĩ Kĩ thuật": 1, "Chương trình tiên tiến": 0.7};
eR["CTTT"] = { "Cử nhân" : 0.8, "Kĩ sư chính quy" : 0.8, "Kĩ sư CLC": 0.9, "Kĩ sư tài năng": 0.8, "HEDSPI": 0.8, "Việt-Pháp": 0.8, "Thạc sĩ Khoa học": 0.6, "Thạc sĩ Kĩ thuật": 0.6, "Chương trình tiên tiến": 0.1};
eR["VB2"] = { "Cử nhân" : 0.9, "Kĩ sư chính quy" : 0.8, "Kĩ sư CLC": 0.9, "Kĩ sư tài năng": 0.9, "HEDSPI": 0.9, "Việt-Pháp": 0.9, "Thạc sĩ Khoa học": 0.3, "Thạc sĩ Kĩ thuật": 0.3, "Chương trình tiên tiến": 0.8};

export default eR;

// console.log(eR["CN"]["Kĩ sư tài năng"])

// function relative(heSV, heDoan) {
//     let dsHe = heDoan.split(", ");
//     let res = 0;
//     for (let h in dsHe) {
//         //console.log(dsHe[h]);
//         console.log(eR[dsHe[h]][heSV])
//         if (eR[dsHe[h]][heSV] > res)
//            res = eR[dsHe[h]][heSV];
//     }
//     return res;
// }



// console.log(relative("Kĩ sư tài năng", 'CN, CTTT, HEDSPI, Không xác định'))