<script setup>
import { showUserMenu } from './HeaderFunctions';
</script>

<template>
    <div class="logo">CLINICA SUBJECTIVITY LTDA 00.000.000/0000-00</div>
    <div class="header-user">
        <div class="avatar">
            <div class="avatar-img">
                <img src="@/assets/img/avatar.png" alt="User" @click="showUserMenu()">
            </div>
            <div id="user-menu">
                <span id="user-title">Deyse Santos</span>
                <hr/>
                <ul>
                    <li><a href="#">Configurações</a></li>
                    <li><a href="#">Sair</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>