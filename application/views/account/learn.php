<?php


$sbj_temp = array('phys', 'math', 'fav', 'demo');
$theme_temp = array(
    'Кинематика',  'Динамика', 'Гидростатика', 'Работа, мощность, энергия',
    'МКТ', 'Термодинамика', 'Электростатика', 'Электрический ток', 'Свойства степеней', 'Свойства корней',
    'Свойства логарифмов', 'Арифметическая прогрессия', 'Геометрическая прогрессия', 'Тригонометрия', 'none'
);
$coincidence = false;

$sbj = $_GET['sbj'];
$theme = $_GET['theme'];

for ($a = 0, $b = count($sbj_temp); $a < $b; $a++) {
    if ($sbj == $sbj_temp[$a]) {
        $coincidence = true;
        break;
    } else {
        $coincidence = false;
    }
}

if (!$coincidence) {
    header('Location: /');
}

for ($a = 0, $b = count($theme_temp); $a < $b; $a++) {
    if ($theme == $theme_temp[$a]) {
        $coincidence = true;
        break;
    } else {
        $coincidence = false;
    }
}

if (!$coincidence) {
    header('Location: /');
}


?>

<link rel="stylesheet" href="public/css/learn.css">
<link rel="stylesheet" href="public/css/icon-font.css">

    <?php

    if (isset($_COOKIE['light_mode'])) {

        if ($_COOKIE['light_mode'] == 'true') {
            echo '<link id="color_mode" rel="stylesheet" href="public/css/light.css">';
        } else {
            echo ' <link id="color_mode" rel="stylesheet">';
        }
    }

    ?>

    <div id="preloader">
        <h2 id="preloader_text">Загрузка...</h2>
    </div>

    <div class="container">
        <div class="formula__name">
        </div>

        <div class="formula-wrapper">
            <div class="require-wrapper">
                <div class="require">
                </div>
            </div>
            <div id="target__items-wrapper">
            </div>
        </div>

        <div class="items-wrapper">
        </div>

        <div class="nav">
            <div class="btns-wrapper">
                <a class="back disabled"><i class="fas fa-long-arrow-alt-down"></i></a>
                <a class="next" id="next">следующая формула <i class="fas fa-long-arrow-alt-right"></i></a>
            </div>
            <a id="exit">Выход</a>
        </div>

    </div>

    <script src="public/js/learn.js" charset="utf-8"></script>

