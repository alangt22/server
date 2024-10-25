const PartyModel = require("../models/Party");

const checkPartyBudget = (budget, services) => {
    const priceSum = services.reduce((sum, service) => sum + service.price, 0);
    return priceSum <= budget; // Retorna verdadeiro se o orçamento é suficiente
};

const partyController = {
    // Criar uma nova festa
    create: async (req, res) => {
        try {
            const { title, author, description, budget, image, services } = req.body;

            const party = { title, author, description, budget, image, services };

            if (services && !checkPartyBudget(budget, services)) {
                return res.status(406).json({ msg: "O seu orçamento é insuficiente." });
            }

            const response = await PartyModel.create(party);
            res.status(201).json({ response, msg: "Festa criada com sucesso." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao criar festa." });
        }
    },

    // Obter todas as festas
    getAll: async (req, res) => {
        try {
            const parties = await PartyModel.find();
            res.json(parties);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao buscar festas." });
        }
    },

    // Obter uma festa específica pelo ID
    get: async (req, res) => {
        try {
            const { id } = req.params;

            const party = await PartyModel.findById(id);
            if (!party) {
                return res.status(404).json({ msg: "Festa não encontrada." });
            }

            res.json(party);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao buscar festa." });
        }
    },

    // Deletar uma festa
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const party = await PartyModel.findById(id);

            if (!party) {
                return res.status(404).json({ msg: "Festa não encontrada." });
            }

            await PartyModel.findByIdAndDelete(id);
            res.status(200).json({ msg: "Festa excluída com sucesso." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao excluir festa." });
        }
    },

    // Atualizar uma festa
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, author, description, budget, image, services } = req.body;

            const partyData = { title, author, description, budget, image, services };

            if (services && !checkPartyBudget(budget, services)) {
                return res.status(406).json({ msg: "O seu orçamento é insuficiente." });
            }

            const updatedParty = await PartyModel.findByIdAndUpdate(id, partyData, { new: true });
            if (!updatedParty) {
                return res.status(404).json({ msg: "Festa não encontrada." });
            }

            res.status(200).json({ updatedParty, msg: "Festa atualizada com sucesso." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "Erro ao atualizar festa." });
        }
    }
};

module.exports = partyController;
