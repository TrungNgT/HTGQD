import React, { useState, useEffect } from 'react';
import './Home.css';
import removeAccents from 'remove-accents';
import eR from '../ExpertRel.js';

function relative(heSV, heDoan) {
  let dsHe = heDoan.split(", ");
  let res = 0;
  for (let h in dsHe) {
      //console.log(dsHe[h]);
      //console.log(eR[dsHe[h]][heSV])
      if (eR[dsHe[h]][heSV] > res)
         res = eR[dsHe[h]][heSV];
  }
  return res;
}

const HomePage = () => {
  // const [mssv, setMssv] = useState('');
  const [khoa, setKhoa] = useState('');
  const [he, setHe] = useState('');
  const [tenDeTai, setTenDeTai] = useState('');
  const [motaDeTai, setMotaDeTai] = useState('');
  const [giangVien, setGiangVien] = useState('');
  const [giangVienList, setGiangVienList] = useState([]);
  const [topGiangVien, setTopGiangVien] = useState([]);
  const [selectedGiangVien, setSelectedGiangVien] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [doanData, setDoanData] = useState([]); // Danh sách đồ án
  const khoaList = ['Khoa Khoa học Máy tính', 'Khoa Kỹ thuật Máy tính'];
  const [departmentWeight, setDepartmentWeight] = useState('');
  const [topicWeight, setTopicWeight] = useState('');
  const [teacherWeight, setTeacherWeight] = useState('');
  const [groupedByGiangVien, setGroupedByGiangVien] = useState([]);


  const [selectedRow, setSelectedRow] = useState(null); // State để lưu thông tin dòng đã chọn

  const handleRowClick = (gv) => {
    if (selectedRow && selectedRow.giangVien["Tên giảng viên"] === gv.giangVien["Tên giảng viên"] && selectedRow.giangVien["Tên đề tài"] === gv.giangVien["Tên đề tài"]) {
      // Nếu bấm vào dòng đã chọn thì ẩn thông tin chi tiết
      setSelectedRow(null);
    } else {
      setSelectedRow(gv); // Nếu bấm vào dòng khác thì cập nhật thông tin chi tiết
    }
  };

  useEffect(() => {
    // Fetch the GiangVienList.json file
    fetch('/GiangVienList.json')
      .then((response) => response.json())
      .then((data) => {
        if (khoa) {
          setGiangVienList(data[khoa] || []); 
        } else {
          setGiangVienList([]);
        }
      })
      .catch((error) => {
        console.error('Error loading GiangVienList.json:', error);
      });
  }, [khoa]); 
  useEffect(() => {
    fetch('/dataDoAn.json') 
      .then((response) => response.json()) 
      .then((data) => {
        setDoanData(data); 
      })
      .catch((error) => {
        console.error('Error loading dataDoAn.json:', error); 
        setErrorMessage('Không thể tải danh sách đồ án.'); 
      });
  }, []); // Chạy một lần khi component được render lần đầu
  const getTopGiangVien = async ( tenDeTai, motaDeTai, doanData, selectedGiangVien) => {
    try {
      /*
      // Gọi API search với tiêu đề và mô tả đề tài đã loại bỏ dấu
      const normalizedTenDeTai = removeAccents(tenDeTai);
      const normalizedMotaDeTai = removeAccents(motaDeTai);
      */
      const req = tenDeTai +' ' + motaDeTai;
      console.log("this is" + req)
      const response = await fetch(
        `http://localhost:3001/search?q=${req}`
      );

      /*
      const response_description = await fetch(
        `http://localhost:3001/search?q=${normalizedMotaDeTai}`
      );
      */
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      /*
      if (!response_description.ok) {
        throw new Error(`API request failed with status: ${response_description.status}`);
      }
      */
  
      const searchResults = await response.json();
  
      // Lấy danh sách kết quả và tính điểm
      const results = searchResults|| [];
      const maxScore = results.length > 0 ? results[0]._score : 1; // Điểm cao nhất

      /*
      const searchResults_des= await response_description.json();
      const results_des = searchResults_des|| [];
      const maxScore_des = response_description.length > 0 ? results_des[0]._score : 1; // Điểm cao nhất
      */
      //console.log(maxScore);
      // Duyệt qua danh sách giảng viên và tính toán điểm
      //console.log(doanData[0].Khoa + "   " +khoa);  
      const scoredGiangVien = doanData
      //.filter((gv) => gv.Khoa === khoa) 
      .map((gv) => {
        //console.log('Giảng viên có khoa trùng với khoa chọn:', gv);  
        const matchingRecords = results.filter(
          (record) => record._id=== gv.id.toString()
        );
        
        const totalScore =
          matchingRecords.reduce((sum, record) => sum + (record._score / maxScore), 0);

        /*
        const totalScore_des =
            matchingRecords_des.reduce((sum, record) => sum + (record._score / maxScore_des), 0);
        */
        const teacherScore = selectedGiangVien.includes(gv["Tên giảng viên"]) ? 1 : 0;

        const S = ["Cử nhân", "Kĩ sư chính quy", "Thạc sĩ Khoa học", "Thạc sĩ Kĩ thuật"]
        const departmentScore = (gv.Khoa !== khoa && S.includes(he)) ? 0 : 1;

        const topicScore = totalScore;
        return {
          giangVien: gv,
          detai: gv["Tên đề tài"],
          topicScore: topicScore,
          nameTopicScore: totalScore,
          // desTopicScore: totalScore_des,
          teacherScore: teacherScore,
          departmentScore: departmentScore,
          score: topicScore * topicWeight +  teacherScore*teacherWeight + departmentScore*departmentWeight,
        };
      });
      const topGiangVien = scoredGiangVien.length > 0
      ? scoredGiangVien.sort((a, b) => b.score - a.score)
      : doanData; 
      const groupedByGiangVienn = topGiangVien.reduce((acc, gv) => {
        // Kiểm tra nếu giảng viên và khoa đã tồn tại trong mảng acc hay chưa
        console.log(gv);
        const existingGiangVienIndex = acc.findIndex(item => item.giangVien["Tên giảng viên"] === gv.giangVien["Tên giảng viên"] && item.giangVien["Khoa"] === gv.giangVien["Khoa"]);
        console.log(existingGiangVienIndex);
        if (existingGiangVienIndex === -1) {
            // Nếu chưa có giảng viên và khoa này, thêm vào mảng
            acc.push(gv);
        } else {
            // Nếu giảng viên và khoa đã có, kiểm tra và thay thế nếu score mới lớn hơn
            if (gv.score > acc[existingGiangVienIndex].score) {
                acc[existingGiangVienIndex] = gv;
            }
        }
        return acc;
    }, []);
    
    setGroupedByGiangVien(groupedByGiangVienn); // Trả về mảng trực tiếp
    
        
      console.log(groupedByGiangVienn);
      return topGiangVien;
    } catch (error) {
      console.error("Error calculating scores:", error);
      return [];
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra nếu các trường bắt buộc chưa được nhập
    if (!he || !khoa || !tenDeTai || !motaDeTai) {
      setErrorMessage('Vui lòng nhập đầy đủ tất cả các trường có dấu sao.');
      setTopGiangVien(null);
      return;
    }
    if(1 - topicWeight - departmentWeight < 0){
      setErrorMessage('Vui lòng nhập lại trọng số cho tổng nhỏ hơn hoặc bằng 1');
      setTopGiangVien(null);
      return;
    }
    if(topicWeight < 0 || departmentWeight < 0){
      setErrorMessage('Vui lòng nhập lại trọng số không âm');
      setTopGiangVien(null);
      return;
    }
    setTeacherWeight(Math.round((1 - topicWeight - departmentWeight) * 100) / 100);
    getTopGiangVien(tenDeTai, motaDeTai, doanData, selectedGiangVien).then((topGiangVien) => {
        console.log("Top 5 giảng viên:", topGiangVien);
        setTopGiangVien(topGiangVien); 
    });
    
    // Xử lý dữ liệu khi người dùng gửi form
    setErrorMessage(''); // Reset thông báo lỗi nếu dữ liệu hợp lệ
    console.log({
      //Mssv: mssv,
      He: he,
      Khoa: khoa,
      TenDeTai: tenDeTai,
      MotaDeTai: motaDeTai,
      GiangVien: selectedGiangVien,
      //normalizedTenDeTai: normalizedTenDeTai,
    });
    console.log(selectedGiangVien);
  };

  const handleGiangVienChange = (e) => {
    setGiangVien(e.target.value);
  };

  const handleAddGiangVien = () => {
    console.log(giangVien);
    if (giangVien && !selectedGiangVien.includes(giangVien)) {
      setSelectedGiangVien([...selectedGiangVien, giangVien]);
      setGiangVien('');
      console.log(111111111);
    }
    console.log(selectedGiangVien);
  };

  const handleRemoveGiangVien = (giangVienName) => {
    setSelectedGiangVien(selectedGiangVien.filter(gv => gv !== giangVienName));
  };

  const heList = [
    "Cử nhân", "Kĩ sư chính quy", "Kĩ sư CLC", "Kĩ sư tài năng", "HEDSPI", "Việt-Pháp", 
    "Thạc sĩ Khoa học", "Thạc sĩ Kĩ thuật", "Chương trình tiên tiến"];

  return (
    <div>
      <h1>Trang Hỗ trợ Lựa chọn Giảng viên Hướng dẫn</h1>
      <form onSubmit={handleSubmit}>
        {/*
        <div>
          <label htmlFor="mssv">Mã số sinh viên (MSSV): <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            id="mssv"
            value={mssv}
            onChange={(e) => setMssv(e.target.value)}
            placeholder="Nhập MSSV"
            required
          />
        </div>
        */}

        <div>
          <label htmlFor="he">Hệ: <span style={{ color: 'red' }}>*</span></label>
          <select
            id="he"
            value={he}
            onChange={(e) => setHe(e.target.value)}
            required
          >
            <option value="">Chọn Hệ</option>
            {heList.map((h, index) => (
              <option key={index} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="khoa">Khoa: <span style={{ color: 'red' }}>*</span></label>
          <select
            id="khoa"
            value={khoa}
            onChange={(e) => setKhoa(e.target.value)}
            required
          >
            <option value="">Chọn Khoa</option>
            {khoaList.map((k, index) => (
              <option key={index} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="departmentWeight">
            Trọng số Khoa: <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="number"
            id="departmentWeight"
            value={departmentWeight}
            onChange={(e) => setDepartmentWeight(e.target.value)}
            placeholder="Nhập trọng số"
            required
          />
        </div>

        <div>
          <label htmlFor="tenDeTai">Tên đề tài: <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            id="tenDeTai"
            value={tenDeTai}
            onChange={(e) => setTenDeTai(e.target.value)}
            placeholder="Nhập Tên đề tài"
            required
          />
        </div>

        <div>
          <label htmlFor="motaDeTai">Mô tả đề tài: <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            id="motaDeTai"
            value={motaDeTai}
            onChange={(e) => setMotaDeTai(e.target.value)}
            placeholder="Nhập Mô tả đề tài"
            required
          />
        </div>
        <div>
          <label htmlFor="topicWeight">
            Trọng số Đề tài: <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="topicWeight"
            id="topicWeight"
            value={topicWeight}
            onChange={(e) => setTopicWeight(e.target.value)}
            placeholder="Nhập trọng số"
            required
          />
        </div>

        <div>
          <label htmlFor="giangVien">Giảng viên hướng dẫn:</label>
          <input
            type="text"
            id="giangVien"
            value={giangVien}
            onChange={handleGiangVienChange}
            placeholder="Nhập tên giảng viên"
            list="giangVienList"
          />
          <datalist id="giangVienList">
            {giangVienList.map((gv, index) => (
              <option key={index} value={gv} />
            ))}
          </datalist>
          <button type="button" onClick={handleAddGiangVien}>
            Thêm giảng viên
          </button>
        </div>
       
        {selectedGiangVien.length > 0 && (
          <div>
            <h3>Giảng viên đã chọn:</h3>
            <ul>
              {selectedGiangVien.map((gv, index) => (
                <li key={index}>
                  {gv}
                  <button type="button" onClick={() => handleRemoveGiangVien(gv)}>
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <button type="submit">Submit</button>
        
      </form>
      {groupedByGiangVien.length > 0 && (
       <div style={{ margin: '30px' }}>
       <h3>Bảng kết quả:</h3>
       <table border="1">
         <thead>
           <tr>
             <th>STT</th>
             <th>Tên Giảng viên</th>
             <th>Đề tài</th>
             <th>Phù hợp khoa</th>
             <th>Phù hợp giảng viên</th>
             <th>Phù hợp đề tài(phù hợp tên đề tài * 0.5 + phù hợp mô tả đề tài * 0.5)</th>
             <th>Tổng hợp(Phù hợp khoa * {departmentWeight} + Phù hợp giảng viên * {teacherWeight} + Phù hợp đề tài * {topicWeight})</th>
           </tr>
         </thead>
         <tbody>
           {groupedByGiangVien.map((gv, index) => (
             <React.Fragment key={index}>
               <tr onClick={() => handleRowClick(gv)}>
                 <td>{index + 1}</td>
                 <td>{gv.giangVien["Tên giảng viên"]}</td>
                 <td>{gv.giangVien["Tên đề tài"]}</td>
                 <td>{gv.departmentScore}</td>
                 <td>{gv.teacherScore}</td>
                 <td>
                   {gv.topicScore}  {/*= {gv.nameTopicScore} * 0.5 + {gv.desTopicScore} * 0.5 */}
                 </td>
                 <td>{gv.score}</td>
               </tr>
 
               {selectedRow && selectedRow.giangVien["Tên giảng viên"] === gv.giangVien["Tên giảng viên"] && selectedRow.giangVien["Tên đề tài"] === gv.giangVien["Tên đề tài"] && (
                 <tr>
                   <td colSpan="7">
                     <div style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>
                       <h4>Thông tin chi tiết:</h4>
                       <p><strong>Giảng viên:</strong> {gv.giangVien["Tên giảng viên"]}</p>
                       <p><strong>Khoa:</strong> {gv.giangVien["Khoa"]}</p>
                       <p><strong>Đề tài:</strong> {gv.giangVien["Tên đề tài"]}</p>
                       <p><strong>Chi tiết:</strong> {gv.giangVien["Chi tiết"]}</p>
                       <p><strong>Số SV:</strong> {gv.giangVien["Số SV"]}</p>
                       <p><strong>Điểm phù hợp đề tài:</strong> {gv.topicScore}</p>
                       <p><strong>Điểm phù hợp giảng viên:</strong> {gv.teacherScore}</p>
                       <p><strong>Điểm phù hợp khoa:</strong> {gv.departmentScore}</p>
                       <p><strong>Điểm tổng:</strong> {gv.score}</p>
                     </div>
                   </td>
                 </tr>
               )}
             </React.Fragment>
           ))}
         </tbody>
       </table>
     </div>
)}

      {/* {topGiangVien.length > 0 && (
        <div className="result-container">
          <h3>Top 5 Giảng viên Hướng dẫn</h3>
          <ul className="result-list">
            {topGiangVien.map((gv, index) => (
              <li key={index} className="result-item">
                <div style={{ color: 'red', fontWeight : 'bold' }}>Tên Giảng viên: {gv.giangVien["Tên giảng viên"]}</div>
                <div>Đề tài: {gv.detai}</div>
                <div>Khoa: {gv.giangVien["Khoa"]}</div>
                <div style={{ color: 'green', fontStyle: 'Italic' }}>Score: {gv.score}</div>
               
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default HomePage;
