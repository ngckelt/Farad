<link rel="stylesheet" href="public/css/aside.css">
<link rel="stylesheet" href="public/css/subject.css">
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

<div class="burger-wrapper">
        <div class="burger">
            <div class="line top-line"></div>
            <div class="line middle-line"></div>
            <div class="line bottom-line"></div>
        </div>
    </div>

    <aside>
        <?php require 'application/views/templates/aside.php' ?>
    </aside>

    <main>

        <div class="content">
            <div class="find">
                <input type="text" id="find" name="find" class="form-control mb-3" placeholder="Найти формулу...">
            </div>

            <div class="btns-wrapper row">
                <a class="btn disabled_btn" id="back"><i class="fas fa-long-arrow-alt-left"></i> Назад</a>
                <?php

                if ($sbj == 'phys') {
                    echo '<a href="learn?theme=none&sbj=phys" class="btn" id="everything">Учить все формулы по физике</a>';
                } else if ($sbj == 'math') {
                    echo '<a href="learn?theme=none&sbj=math" class="btn" id="everything">Учить все формулы по математике</a>';
                } else if ($sbj == 'fav') {
                    echo '<a href="learn?theme=none&sbj=fav" class="btn" id="everything">Учить все избранные формулы</a>';
                }

                ?>

                <?php

                if ($sbj == 'fav') {
                    echo '<a class="btn" id="remove">Убрать все из избранного</a>';
                }

                ?>
            </div>

            <div id="container">
            </div>
        </div>

    </main>


   



<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script src="public/js/index.js"></script>
<script src="public/js/subject.js"></script>





