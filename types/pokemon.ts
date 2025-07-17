import { Resource } from "./common";


// -------------------------
// Data types - pokemon data
// -------------------------

// Data type - main pokemon type
export interface Pokemon {
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
    moves: MoveInfo[];
    species: Resource;
    sprites: SpriteInfo;
    stats: any[];   // TODO: Replace any with real type
    types: any[];
    past_types: any[];
    past_abilities: any[];
};

export interface AbilityInfo {
    is_hidden: boolean;
    slot: number;
    ability: Resource;
};

export interface GameInfo {
    game_index: number;
    version: Resource;
};

export interface ItemInfo {
    item: Resource;
    version_details: Array<{
        rarity: number;
        version: Resource;
    }>;
};

export interface MoveInfo {
    move: Resource,
    version_group_details: VersionGroupInfo[];
}

export interface VersionGroupInfo {
    level_learned_at: number;
    version_group: Resource;
    move_learn_method: Resource;
    order: number;
};

export interface SpriteInfo {
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