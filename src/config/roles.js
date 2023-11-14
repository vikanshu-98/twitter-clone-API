const roles = ['user','admin']

const roleRight = new Map();
roleRight.set(roles[0],[])
roleRight.set(roles[1],['getUsers', 'manageUsers']); 
export default {
    roles,
    roleRight
}      
