"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the awesome ${chalk.red(
          "generator-minecraft-datapack"
        )} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "name",
        message: "Datapack name:"
      },
      {
        type: "input",
        name: "namespace",
        message:
          "Choose a namespace (This must be unique, and only contain alphanumeric and underscores!):"
      },
      {
        type: "list",
        name: "format",
        message: "Please choose a pack format (5 for 1.15+):",
        default: 5,
        choices: [1, 2, 3, 4, 5]
      },
      {
        type: "input",
        name: "description",
        message:
          "Enter a pack descrption (This will be used to describe your pack lol):"
      },
      {
        type: "input",
        name: "main",
        message:
          "Main function name (This function will be called every tick):",
        default: "main"
      },
      {
        type: "input",
        name: "load",
        message:
          "Load function name (This function will be called when loading or reloading a world):",
        default: "load"
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    const props = this.props;
    const pack = {
      pack_format: props.format,
      description: props.description
    };
    const tick = {
      replace: false,
      values: [props.namespace + ":" + props.main]
    };
    const load = {
      replace: false,
      values: [props.namespace + ":" + props.load]
    };
    const gapplerecipe = {
      type: "minecraft:crafting_shaped",
      pattern: ["GGG", "GAG", "GGG"],
      key: {
        G: {
          item: "minecraft:gold_block"
        },
        A: {
          item: "minecraft:apple"
        }
      },
      result: {
        item: "minecraft:enchanted_golden_apple",
        count: 1
      }
    };
    const grass_path_lootTable = {
      type: "minecraft:block",
      pools: [
        {
          rolls: 1,
          entries: [
            {
              type: "minecraft:alternatives",
              children: [
                {
                  type: "minecraft:item",
                  conditions: [
                    {
                      condition: "minecraft:match_tool",
                      predicate: {
                        enchantments: [
                          {
                            enchantment: "minecraft:silk_touch",
                            levels: {
                              max: 1
                            }
                          }
                        ]
                      }
                    }
                  ],
                  name: "minecraft:grass_path"
                },
                {
                  type: "minecraft:item",
                  name: "minecraft:dirt"
                }
              ]
            }
          ]
        }
      ]
    };

    this.fs.writeJSON(this.destinationPath("pack.mcmeta"), { pack: pack });
    this.fs.writeJSON(
      this.destinationPath("data/minecraft/tags/functions/load.json"),
      load
    );
    this.fs.writeJSON(
      this.destinationPath("data/minecraft/tags/functions/tick.json"),
      tick
    );
    this.fs.write(
      this.destinationPath(
        "data/" + props.namespace + "/functions/" + props.load + ".mcfunction"
      ),
      "# Insert your commands here - This will be called on a world load/reload\n\nsay The " +
        props.name +
        " Datapack successfully reloaded!\n"
    );
    this.fs.write(
      this.destinationPath(
        "data/" + props.namespace + "/functions/" + props.main + ".mcfunction"
      ),
      "# Insert your commands here - This will be called every tick (20 time a second)\n"
    );
    this.fs.writeJSON(
      this.destinationPath(
        "data/" + props.namespace + "/recipes/gapplerecipe.json"
      ),
      gapplerecipe
    );
    this.fs.writeJSON(
      this.destinationPath("data/minecraft/loot_tables/blocks/grass_path.json"),
      grass_path_lootTable
    );
  }

  install() {}
};
