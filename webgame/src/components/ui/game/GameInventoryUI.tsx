import { useState } from 'react';
import { Backpack, BookOpen, Settings, X, Sword, Shield, Shirt, HardHat, ChefHat, Users } from 'lucide-react';

const GameInventorySystem = () => {
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('equipment');

    // Mock equipment data
    const equipment = {
        head: { name: 'Iron Helmet', icon: HardHat, rarity: 'common' },
        chest: { name: 'Leather Armor', icon: Shirt, rarity: 'common' },
        legs: { name: 'Chain Leggings', icon: Users, rarity: 'uncommon' },
        feet: { name: 'Boots of Speed', icon: ChefHat, rarity: 'rare' },
        weapon: { name: 'Steel Sword', icon: Sword, rarity: 'uncommon' },
        shield: { name: 'Iron Shield', icon: Shield, rarity: 'common' }
    };

    // Mock inventory items
    const inventoryItems = [
        { id: 1, name: 'Health Potion', count: 5, rarity: 'common' },
        { id: 2, name: 'Mana Crystal', count: 3, rarity: 'rare' },
        { id: 3, name: 'Iron Ore', count: 12, rarity: 'common' },
        { id: 4, name: 'Dragon Scale', count: 1, rarity: 'legendary' },
        { id: 5, name: 'Bread', count: 8, rarity: 'common' },
        { id: 6, name: 'Magic Scroll', count: 2, rarity: 'uncommon' },
    ];

    const getRarityColor = (rarity: any) => {
        switch (rarity) {
            case 'common': return 'border-gray-400 text-gray-300';
            case 'uncommon': return 'border-green-400 text-green-300';
            case 'rare': return 'border-blue-400 text-blue-300';
            case 'epic': return 'border-purple-400 text-purple-300';
            case 'legendary': return 'border-yellow-400 text-yellow-300';
            default: return 'border-gray-400 text-gray-300';
        }
    };

    const EquipmentSlot = ({ slot, item, position }: any) => {
        const Icon = item?.icon || Backpack;
        return (
            <div
                className={`relative w-16 h-16 rounded-md border-2 border-dashed border-gray-600 
          bg-black/30 backdrop-blur-sm flex items-center justify-center transition-all duration-200
          hover:border-theme-light hover:bg-theme-deep/20 ${item ? getRarityColor(item.rarity) : ''}`}
                style={position}
            >
                {item && (
                    <>
                        <Icon size={24} className="text-current" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-theme-deep 
              border border-theme-medium flex items-center justify-center">
                            <span className="text-xs text-white">+</span>
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Custom CSS - Add this to your globals.css */}


            {/* Bottom Right Action Bar */}
            <div className="fixed bottom-6 right-6 flex items-center space-x-2 
          bg-black/10 backdrop-blur-md rounded-md px-3 py-2
          shadow-lg">
                <button
                    onClick={() => setIsInventoryOpen(true)}
                    className="w-12 h-12 rounded-md bg-theme-deep/30 hover:bg-theme-medium/50 
              transition-all duration-200 flex items-center justify-center
              hover:scale-105 active:scale-95"
                >
                    <Backpack size={20} className="text-white" />
                </button>
                <button className="w-12 h-12 rounded-md bg-theme-deep/30 hover:bg-theme-medium/50 
            transition-all duration-200 flex items-center justify-center
            hover:scale-105 active:scale-95">
                    <BookOpen size={20} className="text-white" />
                </button>
                <button className="w-12 h-12 rounded-md bg-theme-deep/30 hover:bg-theme-medium/50 
            transition-all duration-200 flex items-center justify-center
            hover:scale-105 active:scale-95">
                    <Settings size={20} className="text-white" />
                </button>
            </div>

            {/* Inventory Modal */}
            {isInventoryOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsInventoryOpen(false)}
                    />

                    <div className="relative w-full max-w-5xl h-full max-h-[80vh] 
              bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl
              shadow-2xl overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between p-6 
                gradient-theme-header">
                            <div className="flex items-center space-x-4">
                                <Backpack size={24} className="text-theme-light" />
                                <h2 className="text-2xl font-bold text-white">Inventory</h2>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex bg-theme-deep/20 rounded-md p-1">
                                    <button
                                        onClick={() => setActiveTab('equipment')}
                                        className={`px-4 py-2 rounded-md transition-all duration-200 ${activeTab === 'equipment'
                                            ? 'gradient-theme-button text-white'
                                            : 'text-gray-300 hover:text-white hover:bg-theme-medium/30'
                                            }`}
                                    >
                                        Equipment & Items
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('stats')}
                                        className={`px-4 py-2 rounded-md transition-all duration-200 ${activeTab === 'stats'
                                            ? 'gradient-theme-button text-white'
                                            : 'text-gray-300 hover:text-white hover:bg-theme-medium/30'
                                            }`}
                                    >
                                        Stats
                                    </button>
                                </div>
                                <button
                                    onClick={() => setIsInventoryOpen(false)}
                                    className="w-10 h-10 rounded-md bg-red-500/20 hover:bg-red-500/30 
                      transition-all duration-200 flex items-center justify-center
                      text-red-400 hover:text-red-300"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex h-full">
                            {activeTab === 'equipment' && (
                                <>
                                    {/* Equipment Panel */}
                                    <div className="w-80 p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                            <Sword size={18} className="text-theme-light mr-2" />
                                            Equipment
                                        </h3>
                                        <div className="relative w-64 h-80 mx-auto">
                                            {/* Character silhouette */}
                                            <div className="absolute inset-0 gradient-theme-silhouette 
                          rounded-full opacity-30" style={{
                                                    clipPath: 'ellipse(40% 45% at 50% 35%)'
                                                }} />

                                            {/* Equipment slots positioned around character */}
                                            <EquipmentSlot
                                                slot="head"
                                                item={equipment.head}
                                                position={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)' }}
                                            />
                                            <EquipmentSlot
                                                slot="chest"
                                                item={equipment.chest}
                                                position={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)' }}
                                            />
                                            <EquipmentSlot
                                                slot="legs"
                                                item={equipment.legs}
                                                position={{ position: 'absolute', top: '150px', left: '50%', transform: 'translateX(-50%)' }}
                                            />
                                            <EquipmentSlot
                                                slot="feet"
                                                item={equipment.feet}
                                                position={{ position: 'absolute', top: '220px', left: '50%', transform: 'translateX(-50%)' }}
                                            />
                                            <EquipmentSlot
                                                slot="weapon"
                                                item={equipment.weapon}
                                                position={{ position: 'absolute', top: '80px', left: '10px' }}
                                            />
                                            <EquipmentSlot
                                                slot="shield"
                                                item={equipment.shield}
                                                position={{ position: 'absolute', top: '80px', right: '10px' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Items Panel */}
                                    <div className="flex-1 p-6 bg-theme-deep/10">
                                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Backpack size={18} className="text-theme-light mr-2" />
                                                Items
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {inventoryItems.length}/40 slots
                                            </div>
                                        </h3>
                                        <div className="grid grid-cols-8 gap-2">
                                            {Array.from({ length: 40 }, (_, i) => {
                                                const item = inventoryItems[i];
                                                return (
                                                    <div
                                                        key={i}
                                                        className={`w-14 h-14 rounded-md border-2 bg-black/30 backdrop-blur-sm 
                                flex items-center justify-center relative transition-all duration-200
                                hover:bg-theme-deep/20 cursor-pointer ${item
                                                                ? `${getRarityColor(item.rarity)} hover:scale-105 hover:border-theme-light`
                                                                : 'border-gray-700 hover:border-theme-medium'
                                                            }`}
                                                    >
                                                        {item && (
                                                            <>
                                                                <Backpack size={20} className="text-current" />
                                                                <div className="absolute -top-1 -right-1 gradient-theme-count 
                                    text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                                    {item.count}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'stats' && (
                                <div className="flex-1 p-6">
                                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                                        <Shield size={18} className="text-theme-light mr-2" />
                                        Character Stats
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <h4 className="text-md font-semibold text-theme-light mb-3">Combat Stats</h4>
                                            <div className="flex justify-between items-center p-3 bg-theme-deep/10 rounded-md">
                                                <span className="text-gray-300">Attack Power</span>
                                                <span className="text-white font-semibold">127</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-theme-deep/10 rounded-md">
                                                <span className="text-gray-300">Defense</span>
                                                <span className="text-white font-semibold">89</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-theme-deep/10 rounded-md">
                                                <span className="text-gray-300">Critical Hit Rate</span>
                                                <span className="text-white font-semibold">12%</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-theme-deep/10 rounded-md">
                                                <span className="text-gray-300">Attack Speed</span>
                                                <span className="text-white font-semibold">1.2s</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-md font-semibold text-theme-light mb-3">Vital Stats</h4>
                                            <div className="flex justify-between items-center p-3 bg-theme-deep/10 rounded-md">
                                                <span className="text-gray-300">Health</span>
                                                <span className="text-white font-semibold">340/340</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-theme-deep/10 rounded-md">
                                                <span className="text-gray-300">Mana</span>
                                                <span className="text-white font-semibold">180/180</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-theme-deep/10 rounded-md">
                                                <span className="text-gray-300">Speed</span>
                                                <span className="text-white font-semibold">15</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-theme-deep/10 rounded-md">
                                                <span className="text-gray-300">Stamina</span>
                                                <span className="text-white font-semibold">95/100</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <h4 className="text-md font-semibold text-theme-light mb-4">Resistances</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div className="p-3 bg-theme-deep/10 rounded-md text-center">
                                                <div className="text-gray-300 text-sm">Fire</div>
                                                <div className="text-white font-semibold">25%</div>
                                            </div>
                                            <div className="p-3 bg-theme-deep/10 rounded-md text-center">
                                                <div className="text-gray-300 text-sm">Ice</div>
                                                <div className="text-white font-semibold">15%</div>
                                            </div>
                                            <div className="p-3 bg-theme-deep/10 rounded-md text-center">
                                                <div className="text-gray-300 text-sm">Lightning</div>
                                                <div className="text-white font-semibold">30%</div>
                                            </div>
                                            <div className="p-3 bg-theme-deep/10 rounded-md text-center">
                                                <div className="text-gray-300 text-sm">Poison</div>
                                                <div className="text-white font-semibold">40%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GameInventorySystem;