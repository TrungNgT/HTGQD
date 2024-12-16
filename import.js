import { readFile } from 'fs';
// import { join } from 'path';
import { Client } from '@elastic/elasticsearch';
// import { keyboard } from '@testing-library/user-event/dist/keyboard';
// import { text } from 'stream/consumers';

// Khởi tạo client Elasticsearch
const client = new Client({
  node: 'http://localhost:9200',
  auth: {
    username: 'elastic',
    password: 'FokPpOKqXaEC+ItgCdKQ'
  }
});

// create the index 'de_tai' in the defined cluster.
await client.indices.create({
  index: "de_tai",
  settings: {
    number_of_shards: 1,
    analysis: {
      analyzer: {
        my_analyzer: {
          type: "standard",
          filter: "lowercase"
        }
      }
    }
  },
  mappings: {
    properties: {
      "id": {
        type: "keyword"
      },
      "Tên giảng viên": {
        type: "text",
        analyzer: "my_analyzer",
        search_analyzer: "my_analyzer"
      }, 
      "Khoa": {
        type: "text",
        analyzer: "my_analyzer",
        search_analyzer: "my_analyzer"
      }, 
      "Tên đề tài": {
        type: "text",
        analyzer: "my_analyzer",
        search_analyzer: "my_analyzer"
      },
      "Hệ": {
        type: "text",
        analyzer: "my_analyzer",
      },
      "Chi tiết": {
        type: "text",
        analyzer: "my_analyzer",
        search_analyzer: "my_analyzer"
      }
    }
  }
})

client.info().then(console.log, console.log)

// Đọc dữ liệu từ file dataDoAn.json trong thư mục public
//const filePath = join(__dirname, 'public', 'dataDoAn.json');

const filePath = "./public/dataDoAn.json"

readFile(filePath, 'utf8', async (err, data) => {
  if (err) {
    console.error('Lỗi khi đọc file:', err);
    return;
  }

  const documents = JSON.parse(data);

  try {
    // Sử dụng bulk API để nhập dữ liệu vào Elasticsearch
    const body = documents.flatMap(doc => [
      { index: { _index: 'de_tai', _id: doc.id } },
      doc
    ]);

    const response = await client.bulk({ refresh: true, body });
    
    // In toàn bộ phản hồi từ Elasticsearch
    console.log('Bulk Response:', JSON.stringify(response, null, 2));

    // Kiểm tra lỗi trong phản hồi
    if (response.body.errors) {
      console.error('Lỗi khi nhập dữ liệu:', response.body.errors);
    } else {
      console.log('Dữ liệu đã được nhập thành công!');
    }
  } catch (error) {
    console.error('Lỗi khi kết nối với Elasticsearch:', error);
  }
});
