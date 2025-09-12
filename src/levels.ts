export const tileType = {
    wall: '#',
    road: ' ',
    streetlamp: 'O',
    hero: 'H',
    enemy: 'E',
    exit: 'X',
    gap: 'L'
} as const;

export type TileChar = // value of tileType
    typeof tileType[keyof typeof tileType];

export const tileTypeToColor = {
    [tileType.wall]: '#888', // sidewalk
    [tileType.road]: '#444', // road
    [tileType.streetlamp]: '#FFEA00', // streetlamp
    [tileType.hero]: '#00F', // hero
    [tileType.enemy]: '#F00', // enemy
    [tileType.exit]: '#0F0', // exit
    [tileType.gap]: '#0000FF' // gap
};

const toMatrix = (mapString: string): TileChar[][] => {
    return mapString.split('\n').slice(1, -1).map(line => line.split('') as unknown as TileChar[]);
}

export const getNextLevel = (currentLevel: Level): Level | undefined => {
    const currentIndex = levels.indexOf(currentLevel);
    const nextIndex = currentIndex + 1;
    return levels[nextIndex];
}

export type Level = {
    name: string;
    map: TileChar[][];
};

export const levels: Level[] = [
    {
        name: 'Level 1: easy peasy',
        map: toMatrix(`
###########
#         #
#         #
#         #
#  H O    #
#         #
#         #
#         #
#         #
#         #
#         #
#         #
#    O    #
#         #
#         #
#         #
#         #
#         #
#         #
#         #
#    O    #
#         #
#         #
#         #
#        X#
###########
`)

    },
    {// play on words with maze
        name: 'Level 2: a-maze-ing',
        map: toMatrix(`
###########
#         #
#         #
#         #
#  H O    #
#         #
#         #
#         #
########  #
#         #
#         #
#         #
#    O    #
#         #
#         #
#         #
#  ########
#         #
#         #
#         #
#    O    #
#         #
#         #
#         #
#        X#
###########
`)

    },
{
        name: 'Level 3: hello darkness',
        map: toMatrix(`
###########
#         #
#         #
#    H    #
#         #
#######   #
#         #
#         #
#   #######
#         #
#         #
#         #
#    O    #
#         #
#         #
#         #
####   ####
#         #
#         #
#######   #
#         #
#         #
#   #######
#         #
#        X#
###########
`)

    },
    {
        name: 'Level 4: don\'t get we now',
        map: toMatrix(`
###########
#         #
# H       #
#         #
#         #
#    O    #
# LL      #
#LLLLLL   #
#         #
#         #
#         #
#         #
#    O    #
#         #
#         #
#         #
#  ########
#         #
#         #
#         #
#         #
#         #
#         #
#         #
#        X#
###########
`)

    }
];

