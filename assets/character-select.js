/* Blessing Catcher: male/female character selector.
   This runs before game.js so it can choose the character sprite before the game creates its Image. */
(() => {
    const STORAGE_KEY = "blessingCatcherCharacterGender_v1";
    const MALE_SRC = "assets/characters/forge-keeper.png";
    const FEMALE_SRC = "assets/characters/forge-keeper-female.svg";

    const getChoice = () => localStorage.getItem(STORAGE_KEY) || "male";
    const setChoice = value => localStorage.setItem(STORAGE_KEY, value === "female" ? "female" : "male");

    // Intercept the existing game sprite path and swap it when Female is selected.
    const srcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
    if (srcDescriptor && srcDescriptor.set && !HTMLImageElement.prototype.__blessingCharacterSelectorPatched) {
        Object.defineProperty(HTMLImageElement.prototype, "__blessingCharacterSelectorPatched", { value: true });
        Object.defineProperty(HTMLImageElement.prototype, "src", {
            get: srcDescriptor.get,
            set(value) {
                const selected = getChoice();
                const normalized = String(value || "");
                if (selected === "female" && normalized.includes("assets/characters/forge-keeper.png")) {
                    return srcDescriptor.set.call(this, FEMALE_SRC);
                }
                return srcDescriptor.set.call(this, value);
            }
        });
    }

    function addCharacterSelect() {
        const panel = document.querySelector(".select-panel");
        if (!panel || document.getElementById("selCharacter")) return;

        const row = document.createElement("div");
        row.className = "form-row character-select-row";
        row.innerHTML = `
            <label>Character</label>
            <select id="selCharacter">
                <option value="male">👨 Male Forge Keeper</option>
                <option value="female">👩 Female Forge Keeper</option>
            </select>
            <p class="character-select-note">Changing this refreshes the game so the new character loads cleanly.</p>
        `;

        const outfitRow = document.getElementById("selOutfit")?.closest(".form-row");
        if (outfitRow && outfitRow.parentNode === panel) {
            panel.insertBefore(row, outfitRow);
        } else {
            panel.insertBefore(row, panel.firstChild?.nextSibling || panel.firstChild);
        }

        const select = document.getElementById("selCharacter");
        select.value = getChoice();
        select.addEventListener("change", () => {
            setChoice(select.value);
            document.body.classList.add("character-refreshing");
            setTimeout(() => window.location.reload(), 180);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addCharacterSelect);
    } else {
        addCharacterSelect();
    }
})();
