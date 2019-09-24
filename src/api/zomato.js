import axios from 'axios';

export default axios.create({
	baseURL: 'https://developers.zomato.com/api/v2.1/',
	headers: {
		'user-key': 'a1a6e5481fd67938b89e3c9636d6b2cd'
	}
});