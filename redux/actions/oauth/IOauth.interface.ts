
export default interface IOauth {
    authenticate: ()=> void,
    register: (pin: string, mobileno: string)=> void,
}