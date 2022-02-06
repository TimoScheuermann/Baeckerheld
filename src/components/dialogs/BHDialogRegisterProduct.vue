<template>
  <vm-dialog
    class="bh-dialog-register-product"
    v-model="$store.state[key]"
    title="Produkt registrieren"
    @input="setDto"
  >
    <form @submit.prevent>
      <div class="form-input-title">Name des Produkts</div>
      <vm-input v-model="dto.name" placeholder="Bauernbrot" />
      <div class="form-input-title">Preis (in Euro)</div>
      <vm-input
        v-model="dto.price"
        :placeholder="2.1"
        type="number"
        :min="0.01"
      />
      <div class="form-input-title">Beschreibung</div>
      <vm-textarea
        v-model="dto.description"
        placeholder="Dunkles Brot mit Körnern"
      />
      <div class="form-input-title">Lieferzeit (in Stunden)</div>
      <vm-input
        v-model="dto.deliveryTime"
        :placeholder="24"
        :min="0"
        type="number"
      />

      <vm-flow>
        <div class="form-input-title">Zutaten</div>
        <vm-divider />
        <vm-flow>
          <vm-button
            icon="ti-plus"
            :round="true"
            @click="dto.ingredients.push({ name: '', amount: '' })"
          />
        </vm-flow>
      </vm-flow>

      <vm-flow v-for="(i, index) in dto.ingredients" :key="index + 'ing'">
        <vm-input
          placeholder="Beschreibung"
          v-model="dto.ingredients[index].name"
        />
        <vm-input placeholder="Menge" v-model="dto.ingredients[index].amount" />
        <vm-flow>
          <vm-button
            icon="ti-trashcan-alt"
            color="error"
            variant="transparent"
            @click="dto.ingredients.splice(index, 1)"
          />
        </vm-flow>
      </vm-flow>

      <vm-divider position="leading">
        <div class="form-input-title">Nährwerte</div>
      </vm-divider>

      <vm-grid width="120" gap="0 10px">
        <div>
          <div class="form-input-title">Energie</div>
          <vm-input v-model="dto.nutrition.energy" placeholder="1337kcal" />
        </div>
        <div>
          <div class="form-input-title">Fett</div>
          <vm-input v-model="dto.nutrition.fat" placeholder="6g" />
        </div>
        <div>
          <div class="form-input-title">davon gesättigte</div>
          <vm-input v-model="dto.nutrition.saturates" placeholder="1.4g" />
        </div>
        <div>
          <div class="form-input-title">Kohlenhydrate</div>
          <vm-input v-model="dto.nutrition.carbonhydrate" placeholder="62.8g" />
        </div>
        <div>
          <div class="form-input-title">davon Zucker</div>
          <vm-input v-model="dto.nutrition.sugar" placeholder="1.3g" />
        </div>
        <div>
          <div class="form-input-title">Eiweiß</div>
          <vm-input v-model="dto.nutrition.protein" placeholder="13g" />
        </div>
        <div>
          <div class="form-input-title">Salz</div>
          <vm-input v-model="dto.nutrition.salt" placeholder="2g" />
        </div>
      </vm-grid>

      <vm-flow>
        <div class="form-input-title">Bilder</div>
        <vm-divider />
        <vm-flow>
          <vm-button
            icon="ti-plus"
            :round="true"
            @click="dto.images.push({ name: '', src: '' })"
          />
        </vm-flow>
      </vm-flow>

      <vm-flow v-for="(i, index) in dto.images" :key="index + 'img'">
        <vm-input placeholder="Beschreibung" v-model="dto.images[index].name" />
        <vm-input placeholder="URL" v-model="dto.images[index].src" />
        <vm-flow>
          <vm-button
            icon="ti-trashcan-alt"
            color="error"
            variant="transparent"
            @click="dto.images.splice(index, 1)"
          />
        </vm-flow>
      </vm-flow>
    </form>

    <template slot="footer">
      <vm-dialog-button title="Abbrechen" color="color" />
      <vm-dialog-button title="Registrieren" @click="registerProduct" />
    </template>
  </vm-dialog>
</template>

<script lang="ts">
import backend from '@/utils/Backend';
import { Bakery } from '@/utils/BakeryManager';
import { sendNotification } from '@/utils/Functions';
import { ProductManager } from '@/utils/ProductManager';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class BHDialogRegisterProduct extends Vue {
  public key = 'dialog_register_product';
  public bakery: Bakery | null = null;

  public dto = {
    name: '',
    price: 0,
    description: '',
    deliveryTime: 0,
    ingredients: [] as { name: string; amount: string }[], // { name: "", amount: string }
    nutrition: {
      energy: '',
      fat: '',
      saturates: '',
      carbonhydrate: '',
      sugar: '',
      protein: '',
      salt: '',
    },
    images: [] as { name: string; src: string }[], // { name: "", src: string }
  };

  public setDto(): void {
    this.bakery = this.$store.state.bakery;
    if (!this.bakery) this.close();
  }

  mounted(): void {
    this.$router.afterEach(() => {
      this.close();
    });
  }

  public close(): void {
    this.$store.commit(this.key, false);
    this.dto = {
      name: '',
      price: 0,
      description: '',
      deliveryTime: 0,
      ingredients: [],
      nutrition: {
        energy: '',
        fat: '',
        saturates: '',
        carbonhydrate: '',
        sugar: '',
        protein: '',
        salt: '',
      },
      images: [],
    };
  }

  public async registerProduct(): Promise<void> {
    if (!this.bakery) return;

    backend
      .post('product/' + this.bakery.id, this.dto)
      .then(({ data }) => {
        ProductManager.storeProducts([data]);
        this.close();
      })
      .catch(({ message }) => {
        sendNotification({
          title: 'Es ist ein Fehler aufgetreten',
          text: message,
        });
        this.$store.commit(this.key, this.bakery);
      });
  }
}
</script>

<style lang="scss" scoped>
.bh-dialog-register-product {
  //
}
</style>
