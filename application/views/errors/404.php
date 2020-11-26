<!DOCTYPE html>
<html lang="en">

<head>

   
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="https://kit.fontawesome.com/f18df10100.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="public/css/index.css">
<link rel="stylesheet" href="public/css/home.css">

</head>

<style>

body {
    margin: 0;
    padding: 0;
    position: relative;
    font-family: 'Montserrat', sans-serif;
    background: linear-gradient(-45deg, rgb(1,13,32), rgb(10,25,52));
    height: 100vh;
}

.btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    color: rgb(238,238,238);
    background-color: rgb(2,45,186);
    transition: all 400ms ease;
    border-radius: 10px;
    font-weight: 500;
    text-decoration: none;
}

.btn:hover {
    background-color: #011f81;
}

.container {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.container h2 {
    margin-top: 100px;
    color: rgb(11,101,255);
    font-size: 7rem;
}

.container h4 {
    margin-top: 30px;
    font-size: 2rem;
    color:rgb(238,238,238);
}

.container a {
    margin-top: 30px;
}
</style>

<body>

    <div class="container">
        <h2>404 - Не найдено</h2>
        <h4>Такой страницы не существует</h4>
        <?php

        if ( !isset($_SESSION['login']) ) {
            echo '<a class="btn" href="/">Вернуться на главную</a>';
        } else {
            echo '<a class="btn" href="/profile">Вернуться в профиль</a>';
        }

        ?>
    </div>

</body>

</html>