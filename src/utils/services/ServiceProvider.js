import axios from 'axios';

export default async function ServiceProvider({ url = '', data = {}, token = '', headers = '' }) {
    console.log('Data===:', data);
    try {
        const response = await axios.post(url, data, { headers: headers }
        );
        return response;
    } catch (error) {
        if (error.response) {
            console.error('Error Response:', error.response.data);
            console.error('Error Status:', error.response.status);
            console.error('Error Headers:', error.response.headers);
        } else if (error.request) {
            console.error('Error Request:', error.request);
        } else {
            console.error('Error Message:', error.message);
        }
        throw error;
    }
}
