export function maskCPF(value) {
    return value
        .replace(/\D/g, '')
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}
maskCPF.maxlength = 14

export function maskCellphone(value) {
    return value
        .replace(/\D/g, '')
        .slice(0, 11)
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
}
maskCellphone.maxlength = 15

export function gender(value) {
    switch (value) {
        case 'male' :
            return 'Masculino'
        case 'female':
            return 'Feminino'
    }
}

export function bool(value) {
    return value ? 'SIM' : 'NÃO'
}

export function date(value) {
    if (!value) return ''
    const d = new Date(value)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

export function download(value) {
    if (!value) return '';
    console.log(value);
    return '<a href=' + value + ' target="_blank">Download</a>';
}

export function unmask(value) {
    return value ? String(value).replace(/\D/g, '') : '';
}
