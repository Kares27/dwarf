class RuneModel extends GenericAspectModel {
  static placement = "talents";
  static label = "WFRP4E.Rune";
  static plural = "WFRP4E.Runes";

  static LOCALIZATION_PREFIXES = ["WH.Models.rune"];

  static defineSchema() {
    const schema = super.defineSchema();

    schema.SL = new fields.SchemaField({
      value: new fields.NumberField({initial: 0, min: 0, integer: true}),
      required: new fields.NumberField({initial: 10, min: 0, integer: true})
    });

    schema.category = new fields.StringField();

    schema.master = new fields.BooleanField();

    schema.item = new fields.EmbeddedDataField(DocumentReferenceModel);

    return schema;
  }

  static get compendiumBrowserFilters() {
    return new Map([
      ...Array.from(super.compendiumBrowserFilters),
      ["requiredSL", {
        label: "WFRP4E.SL",
        type: "range",
        config: {
          keyPath: "system.SL.required"
        }
      }],
      ["category", {
        label: "WFRP4E.Category",
        type: "string",
        config: {
          keyPath: "system.category"
        }
      }],
      ["master", {
        label: "WFRP4E.MasterRune",
        type: "boolean",
        config: {
          keyPath: "system.master"
        }
      }]
    ]);
  }

  async _preCreate(data, options, user)
  {
    await super._preCreate(data, options, user)
  }

  async _onUpdate(data, options, user)
  {
    if (game.user.id == user)
    {
      if (foundry.utils.hasProperty(options, "changed.system.SL.value") && this.SL.value >= this.SL.required)
      {

        let imbue = await foundry.applications.api.Dialog.confirm({
          window : {title : this.parent.name},
          content : `<p>The ${this.parent.name} is complete! Imbue into ${this.item.document.name}?</p>`
        })
        this.parent.update({"system.SL.value" : 0})

        if (imbue)
        {
          if (this.parent.effects.contents.length)
          {
            this.item.document.createEmbeddedDocuments("ActiveEffect", this.parent.effects.contents);
          }
          else 
          {
            // no effects, but create empty effect
            this.item.document.createEmbeddedDocuments("ActiveEffect", [{name : this.parent.name, img : this.parent.img, system : {transferData : {documentType : "Item"}}}]);
          }
        }
      }
    }
  }

  
  _addModelProperties()
  {
      if (this.parent.actor)
      {
          this.item.relative = this.parent.actor.items;
      }
  }

  get usable() {
    return true;
  }


  get tags() {
    return super.tags.add("rune");
  }

  async _performUsage(context={}) {
    const actor = this.parent.actor;
    let item;

    let skill = actor.itemTypes.skill.find(i => i.name == "Runesmithing")

    if (!skill)
    {
      return ui.notifications.error("Runesmithing Skill not found!")
    }

    if (!this.item.document)
    {
      item = await DragDialog.create({title : this.parent.name, text: "Provide Item to inscribe Rune into.", filter: (document) => 
        {
          if (document.documentName != "Item" || !document.system.isPhysical)
          {
              throw "Must provide a physical Item"
          }
          else if (document.parent?.uuid != actor.uuid)
          {
              throw "Item must be Owned by the same Actor as the Rune"
          }
          else
          {
            return true;
          }
        }});
        await (this.parent.update(this.item.set(item)));
    }

    let difficulty = this.master ? "hard" : "challenging" 

    let test = await actor.setupSkill(skill, foundry.utils.mergeObject({appendTitle : ` - ${this.parent.name}`, fields: {difficulty}}, context));

    await test.roll();

    this.parent.update({"system.SL.value" : this.SL.value + Number(test.result.SL)});


  }

  get listHeader()
  {
      return `<div class="flex large">Progress</div><div></div>`
  }

  get listContent() 
  {
      return `<div class="large flex progress-bar">
          <div class="fill" style="width: ${(this.SL.value / this.SL.required) * 100}%"></div>
      </div>
      <div>${this.SL.value} / ${this.SL.required} SL</div>
      `
  }

  async expandData(htmlOptions) {
    let data = await super.expandData(htmlOptions);
    let properties = [];

    properties.push(`${game.i18n.localize("WFRP4E.RequiredSL")}: ${this.SL.required}`);

    data.properties = properties.filter(p => !!p);
    return data;
  }

  
  // Rune effects should never transfer to actors
  shouldTransferEffect(effect)
  {
    return false;
  }

  // Rune effects should never be applicable to the item
  effectIsApplicable(effect, {ignoreDisabled=false}={}) 
  {
      return false;
  }

  // Only for having the option to check "Equip Transfer" for effects
  get isEquippable() {
    return true;
  }

  async toEmbed(config, options)
  {
      let html = `
      <h4>@UUID[${this.parent.uuid}]{${this.parent.name}}</h4>
      <p><strong>SLs Required</strong>: ${this.SL.required}</p>
      ${this.description.value.split("<hr>")[0] + "<hr></p>"}
      `; // quick fix, should not really do this but it's late 

      if (!this.parent.img.includes("blank.png"))
        {
            html = `<div class="journal-image float-left">
            <img src="${this.parent.img}" height=50 width=50 style="margin-right: 0.5rem">
        </div>` + html
        }
    
  
      let div = document.createElement("div");
      div.style = config.style;
      div.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(`<div style="${config.style || ""}">${html}</div>`, {relativeTo : this, async: true, secrets : options.secrets})
      return div;
  }
}


class RuneSheet extends BaseWFRP4eItemSheet {

  static type="rune"

  static DEFAULT_OPTIONS = {
    classes: [this.type]
  }

  static PARTS = {
    header : {scrollable: [""], template : 'systems/wfrp4e/templates/sheets/item/item-header.hbs', classes: ["sheet-header"] },
    tabs: { scrollable: [""], template: 'systems/wfrp4e/templates/sheets/item/item-tabs.hbs' },
    description: { scrollable: [""], template: 'systems/wfrp4e/templates/sheets/item/tabs/item-description.hbs' },
    details: { scrollable: [""], template: `modules/wfrp4e-dwarfs/templates/rune-details.hbs` },
    effects: { scrollable: [""], template: 'systems/wfrp4e/templates/sheets/item/tabs/item-effects.hbs' },
  }

}


/**
 * Apply Config on init Hook, so Foundry recognizes new Item Data Model and Item Sheet
 */
Hooks.on("init", () => {
  Object.assign(CONFIG.Item.dataModels, {
    "wfrp4e-dwarfs.rune": RuneModel
  });

  foundry.applications.apps.DocumentSheetConfig.registerSheet(Item, "wfrp4e-dwarfs", RuneSheet , {
    types: ["wfrp4e-dwarfs.rune"],
    makeDefault: true
  });
});
