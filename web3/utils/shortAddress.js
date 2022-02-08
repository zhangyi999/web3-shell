export function shortAddress( address = '', len = 4 ) {
    return address.slice(0, len) +'...'+ address.slice(address.length - len)
}