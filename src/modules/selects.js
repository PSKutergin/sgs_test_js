import { URL_API } from '../config.js'
import getData from './getData.js'

export class Selects {
    constructor() {
        this.employees = []
        this.citiesList = []
        this.workshopsList = []
        this.employeesList = []
        this.teamsList = []
        this.shiftsList = []
        this.init()
    }

    async init() {
        this.employees = await this.getEmployees()
        this.citiesList = this.createCitiesList(this.employees)
        this.workshopsList = this.createWorkshopsList(this.employees)
        this.employeesList = this.createEmployeesList(this.employees)
        this.teamsList = await this.getTeams()
        this.shiftsList = await this.getShifts()

        this.renderSelects(this.citiesList, 'cities', 'город')
        this.renderSelects(this.workshopsList, 'workshops', 'цех')
        this.renderSelects(this.employeesList, 'employees', 'сотрудника')
        this.renderSelects(this.teamsList, 'teams', 'бригаду')
        this.renderSelects(this.shiftsList, 'shifts', 'смену')

        const that = this
        this.actionsSelects(that)
    }

    async getTeams() {
        const teams = await getData(`${URL_API}/teams`)
        return teams
    }

    async getEmployees() {
        const employees = await getData(`${URL_API}/employees`)
        return employees
    }

    async getShifts() {
        const shifts = await getData(`${URL_API}/shifts`)
        return shifts
    }

    createCitiesList(list) {
        return list.map((city) => {
            return {
                id: city.id,
                name: city.name
            }
        })
    }

    createWorkshopsList(list) {
        return list.flatMap(city =>
            city.workshops.map(item => ({
                id: item.id,
                name: item.name,
                cityId: city.id
            }))
        )
    }

    createEmployeesList(list) {
        return list.flatMap(city =>
            city.workshops.flatMap(item =>
                item.employees.map(empl => ({
                    id: empl.id,
                    name: empl.name,
                    workshopId: item.id,
                    cityId: city.id
                }))
            )
        )
    }

    createOptinsList(list) {
        return list.map(item => {
            const option = document.createElement('option')
            option.value = item.id
            option.textContent = item.name

            if (item.hasOwnProperty('cityId')) {
                option.dataset.cityId = item.cityId
            }
            if (item.hasOwnProperty('workshopId')) {
                option.dataset.workshopId = item.workshopId
            }

            return option
        })
    }

    renderSelects(list, id, text) {
        const select = document.getElementById(id)
        select.innerHTML = ''
        select.insertAdjacentHTML('beforeend', `<option value="" disabled selected>Выберите ${text}</option>`)
        this.createOptinsList(list).forEach(item => {
            select.appendChild(item)
        })
    }

    actionsSelects(that) {
        const selects = document.querySelectorAll('select')
        const selectCities = selects[0]
        const selectWorkshops = selects[1]

        selects.forEach(select => {
            select.addEventListener('change', () => {
                if (select.id === 'cities') {
                    that.renderSelects(that.workshopsList.filter(item => item.cityId === parseInt(select.value)), 'workshops', 'цех')
                    that.renderSelects(that.employeesList.filter(item => item.cityId === parseInt(select.value)), 'employees', 'сотрудника')
                } else if (select.id === 'workshops') {
                    that.renderSelects(that.employeesList.filter(item => item.workshopId === parseInt(select.value)), 'employees', 'сотрудника')

                    if (selectCities.value === '' || selectCities.value !== parseInt(select.selectedOptions[0].dataset.cityId)) {
                        selectCities.value = parseInt(select.selectedOptions[0].dataset.cityId)
                    }
                } else if (select.id === 'employees') {
                    if (selectCities.value === '' || selectCities.value !== parseInt(select.selectedOptions[0].dataset.cityId)) {
                        selectCities.value = parseInt(select.selectedOptions[0].dataset.cityId)
                    }
                    if (selectWorkshops.value === '' || selectWorkshops.value !== parseInt(select.selectedOptions[0].dataset.workshopId)) {
                        selectWorkshops.value = parseInt(select.selectedOptions[0].dataset.workshopId)
                    }
                }
            })
        })
    }

    getEmployeesAll() {
        return this.employees
    }

    getTeamsAll() {
        return this.teamsList
    }

    getShiftsAll() {
        return this.shiftsList
    }
}