CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    amount DECIMAL NOT NULL,
    from_id INTEGER NOT NULL,
    from_name VARCHAR(100) NOT NULL
    to_id INTEGER NOT NULL,
    to_name VARCHAR(100) NOT NULL
    CONSTRAINT fk_user_from FOREIGN KEY (user_from) REFERENCES users(user_id),
    CONSTRAINT fk_user_to FOREIGN KEY (user_to) REFERENCES users(user_id)
);

SELECT
    t.to_name AS user_name,
    SUM(t.amount) AS total_received_amount
FROM
    transactions t
JOIN users u ON u.id = t.to_id
GROUP BY
    t.to_name
ORDER BY
    total_received_amount DESC
LIMIT 1;


SELECT
    SUM(amount) AS total_money_sent
FROM
    transactions;

    SELECT 
    user_id,
    user_name,
    SUM(total_sent) AS total_sent,
    SUM(total_received) AS total_received
FROM (
    SELECT 
        from_id AS user_id,
        from_name AS user_name,
        SUM(amount) AS total_sent,
        0 AS total_received
    FROM 
        transactions
    GROUP BY 
        from_id, from_name

    UNION ALL

    SELECT 
        to_id AS user_id,
        to_name AS user_name,
        0 AS total_sent,
        SUM(amount) AS total_received
    FROM 
        transactions
    GROUP BY 
        to_id, to_name
) AS subquery
GROUP BY 
    user_id, user_name;


SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE constraint_type = 'FOREIGN KEY' AND tc.table_name = 'transactions';