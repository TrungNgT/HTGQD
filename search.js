// Import Elasticsearch client and other required modules
const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');

const client = new Client({
    node: 'http://localhost:9200',
    auth: {
        username: 'elastic', // Replace with your Elasticsearch username
        password: 'XiH66HdPw5EGj72YyWe3'  // Replace with your Elasticsearch password
    },
    ssl: {
        rejectUnauthorized: false, // Bỏ qua SSL nếu bạn sử dụng chứng chỉ tự ký
    },
    tls: {
        rejectUnauthorized: false, // Bỏ qua SSL nếu bạn sử dụng chứng chỉ tự ký
    },
});

const indexName = 'de_tai'; // Thay thế với tên index của bạn

// Hàm tìm kiếm và xuất dữ liệu ra file JSON
async function searchAndExportData(searchTerm) {
    const filePath = 'searchResult.json'; // Đường dẫn tới file JSON sẽ lưu trữ kết quả tìm kiếm
    const stream = fs.createWriteStream(filePath, { flags: 'w' }); // Tạo stream để ghi dữ liệu ra file

    try {
        // Tìm kiếm với query match cho cả "content" và "description"
        const result = await client.search({
            index: indexName,
            body: {
                query: {
                    bool: {
                        should: [
                            //{ match: { "Tên giảng viên": searchTerm } },
                            { match: { "Tên đề tài": searchTerm } }, // Tìm kiếm trong trường "description"
                            { match: { "Chi tiết": searchTerm } }
                        ]
                    }
                },
               // size: 10, // Lấy 10 kết quả
                min_score: 0, // Đảm bảo rằng tất cả các bản ghi đều được trả về (cả những bản ghi có score = 0)
                size: 10000,
                sort: [{ _score: { order: 'desc' } }] // Sắp xếp theo score giảm dần
            }
        });

        // Ghi kết quả tìm kiếm vào file search_results.json
        stream.write(JSON.stringify(result.hits.hits, null, 2));
        console.log('Kết quả tìm kiếm đã được xuất vào search_results.json thành công.');

    } catch (error) {
        console.error('Lỗi khi xuất dữ liệu:', error);
    } finally {
        // Đảm bảo đóng stream sau khi ghi xong
        stream.end();
    }
}

// Thay thế 'your search term' bằng cụm từ bạn muốn tìm kiếm
searchAndExportData('chatbot');
