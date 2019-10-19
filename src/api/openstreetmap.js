import axios from 'axios';

export default axios.create({
	baseURL: 'https://nominatim.openstreetmap.org/reverse',
	headers: {"Access-Control-Allow-Origin": "*"}
});