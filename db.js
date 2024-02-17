import { createPool } from 'mysql2';
const pool = createPool({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'backend_db'
});

const promisePool = pool.promise();

(async() => {
    await promisePool.query(`create table if not exists users(id varchar(10), name varchar(32));`);
})();

export const getUsers = async () => {
    const [rows] = await promisePool.query('select * from users;');
    console.log(rows);
    return rows;
};

export const insertUser = async (id, name) => {
    await promisePool.query(`insert into users(id, name) values('${id}', '${name}');`);
}

export const findUserById = async (id) => {
    await promisePool.query(`select * from users where id=${id};`);
};

export const updateUser = async (id, data) => {
    for(const k in data) {
        await promisePool.query(`update users set ${k}=${data[k] ?? null} where id='${id}'`);
    }
};

export const deleteUser = async (id) => {
    await promisePool.query(`delete from users where id='${id}'`);
};