import { getTodosPosts, criarPost, atualizarPost, removerPost } from "../models/postsModel.js";
import fs from "fs/promises"; // Usar promises diretamente no fs
import path from "path";
import { ObjectId } from "mongodb";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Função auxiliar para gerar o caminho da imagem
const gerarCaminhoImagem = (id) => `uploads/${id}.png`;

// Função auxiliar para gerar a URL completa da imagem
const gerarUrlImagem = (id, req) => `${req.protocol}://${req.get("host")}/${gerarCaminhoImagem(id)}`;

// Listar todos os posts
export async function listarPosts(req, res) {
    try {
        const posts = await getTodosPosts();
        res.status(200).json(posts);
    } catch (erro) {
        console.error("Erro ao listar posts:", erro.message);
        res.status(500).json({ erro: "Falha ao listar posts" });
    }
}

// Criar um novo post
export async function postarNovoPost(req, res) {
    try {
        const { descricao, alt, titulo } = req.body;

        const postCriado = await criarPost({
            descricao: descricao || "Sem descrição",
            imgUrl: "",
            alt: alt || "Descrição alternativa padrão",
            titulo: titulo || "Título padrão",
        });

        res.status(201).json(postCriado);
    } catch (erro) {
        console.error("Erro ao criar post:", erro.message);
        res.status(500).json({ erro: "Falha ao criar post" });
    }
}

// Upload de imagem e criação de post
export async function uploadImagem(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ erro: "Nenhuma imagem foi enviada." });
        }

        const { descricao, alt, titulo } = req.body;

        // Criação inicial do post
        const postCriado = await criarPost({
            descricao: descricao || "Sem descrição",
            imgUrl: "",
            alt: alt || "Descrição alternativa padrão",
            titulo: titulo || "Título padrão",
        });

        const postId = postCriado.insertedId.toString();
        if (!ObjectId.isValid(postId)) {
            throw new Error("ID do post inválido");
        }

        const caminhoImagem = path.join("uploads", `${postId}.png`);

        // Garante que o diretório 'uploads' existe
        await fs.mkdir("uploads", { recursive: true });

        // Move o arquivo enviado para a pasta correta
        await fs.rename(req.file.path, caminhoImagem);

        const imgUrl = gerarUrlImagem(postId, req);

        await atualizarPost(postId, { imgUrl });

        res.status(201).json({
            message: "Imagem enviada com sucesso!",
            post: { ...postCriado, imgUrl },
        });
    } catch (erro) {
        console.error("Erro ao fazer upload de imagem:", erro.message);
        res.status(500).json({ erro: "Falha ao fazer upload de imagem" });
    }
}


// Atualizar post existente
export async function atualizarNovoPost(req, res) {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ erro: "ID inválido" });
        }

        const imgBuffer = await fs.readFile(gerarCaminhoImagem(id));
        const descricao = await gerarDescricaoComGemini(imgBuffer);

        const { alt, titulo } = req.body;

        const postAtualizado = {
            descricao,
            alt: alt || "Descrição alternativa atualizada",
            imgUrl: gerarUrlImagem(id, req),
            titulo: titulo || "Título atualizado",
        };

        const resultado = await atualizarPost(id, postAtualizado);

        if (!resultado) {
            return res.status(404).json({ erro: "Post não encontrado" });
        }

        res.status(200).json({ mensagem: "Post atualizado com sucesso!", post: postAtualizado });

    } catch (erro) {
        console.error("Erro ao atualizar post:", erro.message);
        res.status(500).json({ erro: "Falha ao atualizar post" });
    }
}

// Função para deletar um post
export async function deletarPost(req, res) {
    try {
        const { id } = req.params;

        // Validação do ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ erro: "ID inválido" });
        }

        // Gera o caminho da imagem associada
        const caminhoImagem = `uploads/${id}.png`;

        // Remove o post do banco de dados
        const resultado = await removerPost(id);

        if (!resultado) {
            return res.status(404).json({
                erro: "Post não encontrado",
                mensagem: `O post com ID ${id} não foi encontrado.`,
            });
        }

        // Tenta remover a imagem associada, se existir
        try {
            await fs.unlink(caminhoImagem);
        } catch (erro) {
            console.warn(`Aviso: Imagem ${caminhoImagem} não encontrada para exclusão.`);
        }

        return res.status(200).json({
            mensagem: `Post com ID ${id} excluído com sucesso.`,
        });
    } catch (erro) {
        console.error("Erro ao excluir post:", erro.message);
        return res.status(500).json({
            erro: "Erro no servidor",
            mensagem: "Não foi possível excluir o post. Por favor, tente novamente.",
        });
    }
}