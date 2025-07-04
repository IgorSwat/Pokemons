// ----------------------
// Data types - universal
// ----------------------

// Universal data type - resource info
export type Resource = {
    name: string;
    url: string;
};

// --------------------
// Data types - pokemon
// --------------------

// Data type - main pokemon type
export type Pokemon = {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    is_default: boolean;
    order: number;
    weight: number;
    abilities: AbilityInfo[];
    forms: Resource[];
    game_indices: GameInfo[];
    held_items: ItemInfo[];
    location_area_encounters: string;
    moves: Array<{
        move: Resource[]; 
        version_group_details: VersionGroupInfo[];
    }>;
    species: Resource;
    sprites: SpriteInfo;
    stats: any[];
    types: any[];
    past_types: any[];
    past_abilities: any[];
};

type AbilityInfo = {
    is_hidden: boolean;
    slot: number;
    ability: Resource;
};

type GameInfo = {
    game_index: number;
    version: Resource;
};

type ItemInfo = {
    item: Resource;
    version_details: Array<{
        rarity: number;
        version: Resource;
    }>;
};

type VersionGroupInfo = {
    level_learned_at: number;
    version_group: Resource;
    move_learn_method: Resource;
    order: number;
};

type SpriteInfo = {
    back_default: string;
    back_female: string | null;
    back_shiny: string;
    back_shiny_female: string | null;
    front_default: string;
    front_female: string | null;
    front_shiny: string;
    front_shiny_female: string | null;
    versions: any;
    other: any;
};