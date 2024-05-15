const mockPool = {
    query: jest.fn().mockImplementation((query, values) => {
        // Assuming the query is for selecting todos
        if (query.startsWith('SELECT')) {
            return Promise.resolve({
                transactions: [
                    {
                        "transaction_id": 43,
                        "amount": "88000",
                        "from_id": 12,
                        "from_name": "Karl",
                        "to_id": 11,
                        "to_name": "Henry"
                    },
                    {
                        "transaction_id": 44,
                        "amount": "100000",
                        "from_id": 7,
                        "from_name": "Richard",
                        "to_id": 4,
                        "to_name": "Charles"
                    },
                    {
                        "transaction_id": 45,
                        "amount": "15000",
                        "from_id": 14,
                        "from_name": "Iraklij",
                        "to_id": 13,
                        "to_name": "Semiuel"
                    },
                    {
                        "transaction_id": 46,
                        "amount": "90000",
                        "from_id": 8,
                        "from_name": "Thomas",
                        "to_id": 6,
                        "to_name": "Frederick"
                    },
                    {
                        "transaction_id": 47,
                        "amount": "200000",
                        "from_id": 12,
                        "from_name": "Karl",
                        "to_id": 6,
                        "to_name": "Frederick"
                    },
                    {
                        "transaction_id": 48,
                        "amount": "245000",
                        "from_id": 10,
                        "from_name": "Arthur",
                        "to_id": 8,
                        "to_name": "Thomas"
                    },
                    {
                        "transaction_id": 49,
                        "amount": "245000",
                        "from_id": 12,
                        "from_name": "Karl",
                        "to_id": 4,
                        "to_name": "Charles"
                    },
                    {
                        "transaction_id": 50,
                        "amount": "245000",
                        "from_id": 7,
                        "from_name": "Richard",
                        "to_id": 9,
                        "to_name": "William"
                    },
                    {
                        "transaction_id": 51,
                        "amount": "160000",
                        "from_id": 7,
                        "from_name": "Richard",
                        "to_id": 12,
                        "to_name": "Karl"
                    },
                    {
                        "transaction_id": 52,
                        "amount": "50000",
                        "from_id": 12,
                        "from_name": "Karl",
                        "to_id": 10,
                        "to_name": "Arthur"
                    },
                    {
                        "transaction_id": 53,
                        "amount": "360000",
                        "from_id": 9,
                        "from_name": "William",
                        "to_id": 13,
                        "to_name": "Semiuel"
                    },
                    {
                        "transaction_id": 54,
                        "amount": "399000",
                        "from_id": 4,
                        "from_name": "Charles",
                        "to_id": 5,
                        "to_name": "Edward"
                    },
                    {
                        "transaction_id": 55,
                        "amount": "51000",
                        "from_id": 12,
                        "from_name": "Karl",
                        "to_id": 8,
                        "to_name": "Thomas"
                    },
                    {
                        "transaction_id": 56,
                        "amount": "51000",
                        "from_id": 7,
                        "from_name": "Richard",
                        "to_id": 5,
                        "to_name": "Edward"
                    },
                    {
                        "transaction_id": 57,
                        "amount": "200000",
                        "from_id": 7,
                        "from_name": "Richard",
                        "to_id": 5,
                        "to_name": "Edward"
                    },
                    {
                        "transaction_id": 58,
                        "amount": "20000",
                        "from_id": 10,
                        "from_name": "Arthur",
                        "to_id": 6,
                        "to_name": "Frederick"
                    },
                    {
                        "transaction_id": 59,
                        "amount": "800000",
                        "from_id": 6,
                        "from_name": "Frederick",
                        "to_id": 7,
                        "to_name": "Richard"
                    },
                    {
                        "transaction_id": 60,
                        "amount": "1000000",
                        "from_id": 6,
                        "from_name": "Frederick",
                        "to_id": 15,
                        "to_name": "Jounis"
                    },
                    {
                        "transaction_id": 61,
                        "amount": "4000000",
                        "from_id": 6,
                        "from_name": "Frederick",
                        "to_id": 15,
                        "to_name": "Jounis"
                    },
                    {
                        "transaction_id": 62,
                        "amount": "4000000",
                        "from_id": 6,
                        "from_name": "Frederick",
                        "to_id": 15,
                        "to_name": "Jounis"
                    }
                ],
                users:[
                    {
                        "id": 4,
                        "name": "Charles"
                    },
                    {
                        "id": 5,
                        "name": "Edward"
                    },
                    {
                        "id": 6,
                        "name": "Frederick"
                    },
                    {
                        "id": 7,
                        "name": "Richard"
                    },
                    {
                        "id": 8,
                        "name": "Thomas"
                    },
                    {
                        "id": 9,
                        "name": "William"
                    },
                    {
                        "id": 10,
                        "name": "Arthur"
                    },
                    {
                        "id": 11,
                        "name": "Henry"
                    },
                    {
                        "id": 12,
                        "name": "Karl"
                    },
                    {
                        "id": 13,
                        "name": "Semiuel"
                    },
                    {
                        "id": 14,
                        "name": "Iraklij"
                    },
                    {
                        "id": 15,
                        "name": "Jounis"
                    }

                ]
            });
        }
    })
};

module.exports = mockPool;