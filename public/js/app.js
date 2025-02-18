//fetch request

fetch('http://localhost:3000/api/items')
.then(response => {
if (!response.ok) {
throw new Error('Network response was not OK');
}
return response.json();
})
.then(data => {
console.log('GET response data:', data);
})