// Desativa o zoom da página
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && (event.key === '=' || event.key === '+' || event.key === '-' || event.key === '_')) {
        event.preventDefault()
    }
})
window.addEventListener('wheel', function(event) {
    if (event.ctrlKey) {
        event.preventDefault()
    }
}, { passive: false })

// Desativa o comportamento de arrastar imagens
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img')
    images.forEach(image => {
        image.addEventListener('dragstart', event => {
            event.preventDefault()
        })
    })
})
