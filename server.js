//express 모듈 불러오기
import express, { json, urlencoded } from "express";
import { getUsers, insertUser, findUserById, updateUser, deleteUser } from "./db.js";

//express 사용
const app = express();

const __dirname = import.meta.dirname;

//Express 4.16.0버전 부터 body-parser의 일부 기능이 익스프레스에 내장 body-parser 연결 
app.use(json());
app.use(urlencoded({ extended: true}));

/**
 * 파라미터 변수 뜻
 * req : request 요청
 * res : response 응답
 */

/**
 * @path {GET} http://localhost:3000/
 * @description 요청 데이터 값이 없고 반환 값이 있는 GET Method
 */
app.get("/", async(req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

/**
 * @path {GET} http://localhost:3000/api/users
 * @description 요청 데이터 값이 없고 반환 값이 있는 GET Method
 */
app.get("/api/users", async(req, res) => {
    const users = await getUsers();
    res.json({ok: true, users: users});
});

/**
 * @path {GET} http://localhost:3000/api/users/user?user_id=1
 * @description Query Params 요청 데이터 값이 있고 반환 값이 있는 GET Method 
 * 
 *  Query Params 방식
 *  user 뒤에 user_id변수를 통해 값을 찾아 올수 있다.
 *  &를 통해 두번째 변수를 받아서 사용할 수 있다.(/user?user_id=1&name="유저1")
 * 
 */
app.get("/api/users/user", async(req, res) => {

    const user_id = req.query.user_id;

    const user = await findUserById(user_id);

    res.json({ok: false, user: user});
});
 
/**
 * @path {GET} http://localhost:3000/api/users/:user_id
 * @description Path Variables 요청 데이터 값이 있고 반환 값이 있는 GET Method 
 * 
 *  Path Variables 방식
 * 
 *  ex) 아래 GET 주소 에서 :user_id 는 서버에서 설정한 주소 키 값이다.
 *      값을 찾을 때는 req.params.user_id 로 값을 찾는다.
 * 
 *  *주의 사항*
 *  :user_id 이 부분은 변수이기 때문에 
 *  경로가 /users/1 이거나 /users/2 이거 일때 둘다 라우터를 거치게 된다.
 *  그렇기 때문에 다른 라우터 보다 아래 있어야 한다.
 */
app.get("/api/users/:user_id", async(req, res) => {

    const user_id = req.params.user_id;

    const user = await findUserById(user_id);

    res.json({ok: false, user: user});
})


/**
 * @path {POST} http://localhost:3000/api/users/add
 * @description POST Method
 * 
 *  POST 데이터를 생성할 때 사용된다.
 *  req.body에 데이터를 담아서 보통 보낸다.
 */
app.post("/api/users/add", async(req, res) => {

    // 구조분해를 통해 id 와 name을 추출
    const { id, name } = req.body;

    await insertUser(id, name);

    const users = await getUsers();

    res.json({ok: true, users: users});
})

/**
 * @path {PUT} http://localhost:3000/api/users/update
 * @description 전체 데이터를 수정할 때 사용되는 Method
 */
app.put("/api/users/update", async(req, res) => {
    
    // 구조분해를 통해 id 와 name을 추출
    const { id, name } = req.body;

    await updateUser(id, name);

    const user = await findUserById(id);

    res.json({ok: true, user: user});
})

/**
 * @path {DELETE} http://localhost:3000/api/user/delete
 * @description 데이터 삭제
 * 
 */
app.delete("/api/user/delete", async(req, res) => {

    const user_id = req.query.user_id;

    await deleteUser(user_id);

    const users = await getUsers();

    res.json({ok: true, users: users});
})

// http listen port 생성 서버 실행
app.listen(8080, () => {
    console.log("running...");
});