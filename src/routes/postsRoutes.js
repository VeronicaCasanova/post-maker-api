import express from "express";
import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost, deletarPost } from "../controllers/postsController.js";

// Obtendo o diretório atual no modo ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração de CORS
const corsOptions = {
    origin: [
        "http://localhost:8000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
};

// Configuração de armazenamento do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Diretório para salvar uploads
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Nome original do arquivo
    },
});

// Configuração do Multer para limitar o tamanho e filtrar arquivos
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /png/;
        const isValid =
            allowedTypes.test(file.mimetype) &&
            allowedTypes.test(path.extname(file.originalname).toLowerCase());

        if (isValid) {
            cb(null, true); // Arquivo válido
        } else {
            const error = new Error("Formato de arquivo inválido. Apenas imagens PNG de até 2MB são permitidas.");
            error.code = "LIMIT_FILE_FORMAT"; // Código personalizado
            cb(error); // Passa o erro para o middleware de erro
        }
    },
});

// Função principal para configurar as rotas
const routes = (app) => {
    app.use(express.json());
    app.use(cors(corsOptions));

    // Servir arquivos estáticos do diretório 'uploads'
    app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

    // Rotas
    app.get("/posts", listarPosts);
    app.post("/posts", postarNovoPost);
    app.post("/upload", upload.single("imagem"), uploadImagem);
    app.put("/upload/:id", atualizarNovoPost);
    app.delete("/posts/:id", deletarPost);


    // Middleware de tratamento de erros
    app.use((err, req, res, next) => {
        console.error("Erro capturado:", err); // Log detalhado no console

        if (err instanceof multer.MulterError) {
            // Tradução de mensagens específicas do Multer
            let mensagem;
            if (err.code === "LIMIT_FILE_SIZE") {
                mensagem = "O arquivo excede o tamanho máximo permitido de 2MB.";
            } else {
                mensagem = "Ocorreu um erro no upload do arquivo.";
            }

            return res.status(400).json({
                erro: "Erro no upload",
                mensagem,
            });
        }

        if (err.code === "LIMIT_FILE_FORMAT") {
            return res.status(400).json({
                erro: "Erro no upload",
                mensagem: "Formato de arquivo inválido. Apenas imagens PNG de até 2MB são permitidas.",
            });
        }

        // Erros genéricos
        if (err) {
            return res.status(500).json({
                erro: "Erro no servidor",
                mensagem: "Algo deu errado no servidor. Por favor, tente novamente.",
            });
        }

        next();
    });

};

export default routes;
