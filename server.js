import express from "express";
import routes from "./src/routes/postsRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Configura as rotas da aplicação
routes(app);

// Aplica os headers de segurança
app.use(headers);

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}...`);
});
