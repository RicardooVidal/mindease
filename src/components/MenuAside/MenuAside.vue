<script setup>
    import Search from '../Search/Search.vue';
    import {openPatients, selectPatientActive, selectPatientInactive} from './MenuAsideFunctions';
</script>

<template>
    <nav class="container">
        <div class="nav-search">
            <Search 
                placeholder="Pacientes Ativos"
                id="active-patients"
                :action="() => openPatients('active')" 
                autocomplete="off"
            />
            <div class="patients-results-active">
                <router-link :to="'/patient/1'" @click.prevent = selectPatientActive(1)>Paciente 1</router-link>
                <router-link :to="'/patient/2'" @click.prevent = selectPatientActive(2)>Paciente 2</router-link>
                <router-link :to="'/patient/3'" @click.prevent = selectPatientActive(3)>Paciente 3</router-link>
            </div>
                
            <span class="icon-search">
                <img src="@/assets/img/icon_search.svg" alt="Search"/>
            </span>
        </div>
        <div class="nav-search">
            <Search 
                placeholder="Pacientes Inativos"
                id="inactive-patients"
                :action="() => openPatients('inactive')" 
                autocomplete="off"
            />
            <div class="patients-results-inactive">
                <router-link :to="'/patient/4'" @click.prevent = selectPatientInactive(4)>Paciente 4</router-link>
                <router-link :to="'/patient/5'" @click.prevent = selectPatientInactive(5)>Paciente 5</router-link>
                <router-link :to="'/patient/6'" @click.prevent = selectPatientInactive(6)>Paciente 6</router-link>
            </div>
                
            <span class="icon-search">
                <img src="@/assets/img/icon_search.svg" alt="Search"/>
            </span>
        </div>
        <div class="nav-menu">
            <RouterLink :to="'/'">Dashboards</RouterLink>
            <RouterLink :to="'/patient/new'">Cadastrar Paciente</RouterLink>
            <RouterLink :to="'/patient/list'">Lista de Pacientes</RouterLink>
            <RouterLink :to="'/wait-list'">Lista de Espera</RouterLink>
            <RouterLink :to="'/prices'">Preços</RouterLink>
        </div>
    </nav>
</template>