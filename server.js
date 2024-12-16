import express, { json } from 'express';
import { Client } from '@elastic/elasticsearch';
const app = express();
const port = 3001; // Cổng mà server sẽ chạy
import removeAccents from 'remove-accents';
import cors from 'cors';
// Khởi tạo client Elasticsearch

const client = new Client({
    node: 'http://localhost:9200',
    auth: {
        username: 'elastic',  // Thay thế với username của bạn
        password: 'FokPpOKqXaEC+ItgCdKQ'  // Thay thế với password của bạn
    },
    ssl: {
        rejectUnauthorized: false, // Bỏ qua SSL nếu sử dụng chứng chỉ tự ký
    },
    tls: {
        rejectUnauthorized: false, // Bỏ qua SSL nếu sử dụng chứng chỉ tự ký
    },
});

const indexName = 'de_tai'; // Tên index của bạn
app.use(cors({
    origin: 'http://localhost:3000',  // Allow requests from the frontend
    methods: 'GET,POST',  // Allow these HTTP methods
    allowedHeaders: 'Content-Type',  // Allow specific headers
  }));
// Middleware để parse body request
app.use(json());

// API để tìm kiếm và trả về kết quả với score và id
app.get('/search', async (req, res) => {
    let searchTerm = req.query.q; // Lấy từ khóa tìm kiếm từ query params (ví dụ: ?q=Ngọc)

    if (!searchTerm) {
        return res.status(400).send({ error: 'Thiếu từ khóa tìm kiếm (query parameter "q").' });
    }
    // searchTerm = removeAccents(searchTerm);
    try {
        // Tìm kiếm Elasticsearch với query bool
        const result = await client.search({
            index: indexName,
            body: {
                query: {
                    multi_match: {
                        query: searchTerm,
                        fields: ["Tên đề tài", "Chi tiết"]
                    }
                    // bool: {
                    //     should: [
                    //         //{ match: { "Tên giảng viên": searchTerm } },
                    //         { match: { "Tên đề tài": searchTerm } } // Tìm kiếm trong trường "description"
                    //     ]
                    // }
                },
                size: 400, // Lấy 400 kết quả
                sort: [{ _score: { order: 'desc' } }] // Sắp xếp theo độ phù hợp (score)
            }
        });

        // Trả về kết quả tìm kiếm chỉ với id và score
        const searchResults = result.hits.hits;
        
        console.log(searchTerm);
        console.log('Kết quả tìm kiếm:', searchResults);

        return res.json(searchResults);

    } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error);
        return res.status(500).send({ error: 'Lỗi khi tìm kiếm từ Elasticsearch.' });
    }
});

// Khởi động server trên cổng 3001
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
