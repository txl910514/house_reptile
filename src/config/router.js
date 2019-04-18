module.exports = [
    [/\/usr(?:\/(\w+))?/, 'usr?id=:1', 'rest'],
    [/\/login(?:\/(\w+))?/, 'login/index?id=:1'],
    [/\/housePrice(?:\/(\w+))?/, 'housePrice/index?id=:1']
];