export const tileType = {
    wall: '#',
    road: ' ',
    streetlamp: 'O',
    hero: 'H',
    enemy: 'E',
    exit: 'X'
};

export const tileTypeToColor = {
    [tileType.wall]: '#888', // sidewalk
    [tileType.road]: '#444', // road
    [tileType.streetlamp]: '#FFEA00', // streetlamp
    [tileType.hero]: '#00F', // hero
    [tileType.enemy]: '#F00', // enemy
    [tileType.exit]: '#0F0' // exit
};

const toMatrix = (mapString: string): string[][] => {
    return mapString.split('\n').slice(1, -1).map(line => line.split(''));
}

export const levels = [
    {
        name: 'Level 1',
        map: toMatrix(`
##########
#H   O   #
#        #
#        #
#        #
#        #
#        #
#        #
#    O   #
#        #
#        #
#        #
#        #
#        #
#        #
#        #
#    O  E#
#        #
#        #
#       X#
##########
`)

    }
];

