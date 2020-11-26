

<h2 class="logo-wrapper">
    <img src="public/media/logo.svg" class="logo"> 
</h2>

<div class="user row">
    <i class="fas fa-user-circle"></i>
    <p><?=$login?></p>
</div>

<nav>

    <a href="math">
        <div class="nav__item row">
            <i class="fas fa-square-root-alt"></i>
            <p>Математика</p>
        </div>
    </a>

    <a href="phys">
        <div class="nav__item row">
            <i class="fas fa-atom"></i>
            <p>Физика</p>
        </div>
    </a>

    <a href="fav">
        <div class="nav__item row">
            <i class="fas fa-heart"></i>
            <p>Избранное</p>
        </div>
    </a>

    <a href="profile">
        <div class="nav__item row">
            <i class="fas fa-user"></i>
            <p>Профиль</p>
        </div>
    </a>

    <a href="logout">
        <div class="nav__item row">
            <i class="fas fa-sign-out-alt"></i>
            <p>Выйти</p>
        </div>
    </a>
</nav>


<?php require 'application/views/templates/footer.php'; ?>

