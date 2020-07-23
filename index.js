import { Select } from './components/select/select'
import 'typeface-roboto'
import 'normalize.css'
import './assets/scss/main.scss'
import './components/select/select.scss'

const select = new Select('#select', {
	placeholder: 'Выбор',
	data: [
		{ id: '1', value: 'One' },
		{ id: '2', value: 'Two' },
		{ id: '3', value: 'Three' },
		{ id: '4', value: 'Four' },
		{ id: '5', value: 'Five' },
		{ id: '6', value: 'Six' },
		{ id: '7', value: 'Seven' },
	],
	selectedId: '1',
	onSelect(item) {
		console.log('Selected item: ', item)
	},
})

window.select = select
