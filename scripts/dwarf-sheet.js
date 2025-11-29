class DwarfCharacterSheet extends ActorSheetWFRP4eCharacter {
    static DEFAULT_OPTIONS = {
        classes: ["dwarf"],
        actions: {
            resolveGrudge: this._onResolveGrudge
        }
    }

    static PARTS = {
        header: { scrollable: [""], template: 'systems/wfrp4e/templates/sheets/actor/character/character-header.hbs', classes: ["sheet-header"] },
        tabs: { scrollable: [""], template: 'systems/wfrp4e/templates/sheets/actor/actor-tabs.hbs' },
        main: { scrollable: [""], template: 'systems/wfrp4e/templates/sheets/actor/character/character-main.hbs' },
        skills: { scrollable: ["", ".basic .list-content", ".advanced .list-content"], template: 'systems/wfrp4e/templates/sheets/actor/tabs/actor-skills.hbs' },
        talents: { scrollable: [""], template: 'systems/wfrp4e/templates/sheets/actor/tabs/actor-talents.hbs' },
        combat: { scrollable: [""], template: 'systems/wfrp4e/templates/sheets/actor/tabs/actor-combat.hbs' },
        effects: { scrollable: [""], template: 'systems/wfrp4e/templates/sheets/actor/tabs/actor-effects.hbs' },
        magic: { scrollable: [""], template: 'systems/wfrp4e/templates/sheets/actor/tabs/actor-magic.hbs' },
        religion: { scrollable: [""], template: 'systems/wfrp4e/templates/sheets/actor/tabs/actor-religion.hbs' },
        trappings: { scrollable: [""], template: 'systems/wfrp4e/templates/sheets/actor/tabs/actor-inventory.hbs' },
        notes: { scrollable: [""], template: 'modules/wfrp4e-dwarfs/templates/dwarf-notes.hbs' },
    }

    get title() {
        return this.document.name;
    }


    async _onRender(options) {
        await super._onRender(options);
        try 
        {
            this.element.querySelector("[data-action='toggleControls']").dataset.tooltip = "Rune of Control";
            this.element.querySelector("[data-action='close']").dataset.tooltip = "Rune of Closing";
            this.element.querySelector("[data-action='copyUuid']").dataset.tooltip = "Rune of Identification";
            this.element.querySelector(".window-resize-handle").style.opacity = 0;
        }
        catch (e) 
        {

        }
    }

    async _prepareContext(options) {
        let context = await super._prepareContext(options);

        // Since grudges are flags they are added as null/undefined, so convert them to objects
        let grudges = foundry.utils.deepClone(this.actor.getFlag("wfrp4e-dwarfs", "grudges") || []).map(grudge => {
            if (!grudge) {
                return {};
            }
            else return grudge
        });
        grudges.forEach((g, i) => g.index = i);

        context.grudges = {
            active: grudges.filter(i => !i.resolved),
            inactive: grudges.filter(i => i.resolved)
        }
        return context;
    }

    static async _onResolveGrudge(ev, target) {
        if (await foundry.applications.api.Dialog.confirm({
            content: `Resolve this Grudge and add XP?`,
            window: { title: "Resolve Grudge" }
        })) {
            let grudges = foundry.utils.deepClone(this.actor.getFlag("wfrp4e-dwarfs", "grudges"))
            let index = this._getIndex(ev);
            grudges[index].resolved = true;

            await this.actor.setFlag("wfrp4e-dwarfs", "grudges", grudges);

            await this.actor.system.awardExp(grudges[index].blood ? 50 : 25, `Resolved Grudge (${grudges[index].offence})`, null, true);

            ChatMessage.create({
                content: `
            <p><strong>Offence</strong>: ${grudges[index].offence}</p>
            <p><strong>Restitution</strong>: ${grudges[index].restitution}</p>
            <p><strong>Awarded XP</strong>: ${grudges[index].blood ? 50 : 25}`,

                speaker: { alias: this.actor.name }, flavor: "Grudge Resolved"
            })

        }
    }
}

Hooks.on("init", () => {
    foundry.applications.apps.DocumentSheetConfig.registerSheet(CONFIG.Actor.documentClass, "wfrp4e", DwarfCharacterSheet, { types: ["character"], label: "Dwarf Character Sheet" });
})

Hooks.on("createActor", (actor) => {
    if (actor.type == "character" && actor.system.details?.species?.value.toLowerCase() == "dwarf")
    {
        actor.update({"flags.core.sheetClass" : "wfrp4e.DwarfCharacterSheet"});
    }
})