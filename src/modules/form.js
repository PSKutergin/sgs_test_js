import { Selects } from './selects.js'

export class Form {
    constructor() {
        this.init()
    }

    init() {
        const that = this;

        this.selector = new Selects();
        this.form = document.querySelector('.form');
        this.fields = this.form.querySelectorAll('select');
        this.processElement = this.form.querySelector('.button');

        this.fields.forEach(item => {
            item.addEventListener('change', () => {
                that.isEmptyField();
            })
        });

        this.submitForm();
    }

    submitForm() {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault()

            this.employees = this.selector.getEmployeesAll();
            this.teams = this.selector.getTeamsAll();
            this.shifts = this.selector.getShiftsAll();
            this.dataForm = new FormData(this.form);

            const formDataObject = Object.fromEntries(this.dataForm);

            formDataObject.city = this.getCityName(formDataObject.city);
            formDataObject.workshop = this.getWorkshopName(formDataObject.city, formDataObject.workshop);
            formDataObject.employee = this.getEmployeeName(formDataObject.city, formDataObject.workshop, formDataObject.employee);
            formDataObject.team = this.getTeamName(formDataObject.team);
            formDataObject.shift = this.getShiftName(formDataObject.shift);

            document.cookie = "formData=" + JSON.stringify(formDataObject);
            this.form.reset()
        })
    }

    isEmptyField() {
        let isEmpty

        this.fields.forEach(item => item.value ? isEmpty = true : isEmpty = false);
        if (isEmpty) {
            this.processElement.removeAttribute('disabled')
        } else {
            this.processElement.setAttribute('disabled', 'disabled')
        }
    }

    getCityName(cityId) {
        const city = this.employees.find(city => city.id === parseInt(cityId));
        return city ? city.name : '';
    }

    getWorkshopName(cityName, workshopId) {
        const city = this.employees.find(city => city.name === cityName);
        if (city) {
            const workshop = city.workshops.find(workshop => workshop.id === parseInt(workshopId));
            return workshop ? workshop.name : '';
        }
        return '';
    }

    getEmployeeName(cityName, workshopName, employeeId) {
        const city = this.employees.find(city => city.name === cityName);
        if (city) {
            const workshop = city.workshops.find(workshop => workshop.name === workshopName);
            if (workshop) {
                const employee = workshop.employees.find(employee => employee.id === parseInt(employeeId));
                return employee ? employee.name : '';
            }
        }
        return '';
    }

    getTeamName(teamId) {
        const team = this.teams.find(team => team.id === parseInt(teamId));
        return team ? team.name : '';
    }

    getShiftName(shiftId) {
        const shift = this.shifts.find(shift => shift.id === parseInt(shiftId));
        return shift ? shift.name : '';
    }
}