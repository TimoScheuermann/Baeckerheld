<template>
  <vm-dialog
    class="bh-dialog-edit-product"
    v-model="$store.state[key]"
    title="Produkt bearbeiten"
    @input="setDto"
  >
    <form @submit.prevent v-if="product">
      <div class="form-input-title">Name des Produkts</div>
      <vm-input :placeholder="product.name" v-model="dto.name" />
      <div class="form-input-title">Preis (in Euro)</div>
      <vm-input
        v-model="dto.price"
        :placeholder="product.price"
        type="number"
        :min="0.01"
      />
      <div class="form-input-title">Beschreibung</div>
      <vm-textarea
        v-model="dto.description"
        :placeholder="product.description"
      />
      <div class="form-input-title">Lieferzeit (in Stunden)</div>
      <vm-input
        v-model="dto.deliveryTime"
        :placeholder="product.deliveryTime"
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
          :placeholder="placeholderIngredient(index, 'name')"
          v-model="dto.ingredients[index].name"
        />
        <vm-input
          :placeholder="placeholderIngredient(index, 'amount')"
          v-model="dto.ingredients[index].amount"
        />
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
          <vm-input
            v-model="dto.nutrition.energy"
            :placeholder="placeholderNutrition('energy')"
          />
        </div>
        <div>
          <div class="form-input-title">Fett</div>
          <vm-input
            v-model="dto.nutrition.fat"
            :placeholder="placeholderNutrition('fat')"
          />
        </div>
        <div>
          <div class="form-input-title">davon gesättigte</div>
          <vm-input
            v-model="dto.nutrition.saturates"
            :placeholder="placeholderNutrition('saturates')"
          />
        </div>
        <div>
          <div class="form-input-title">Kohlenhydrate</div>
          <vm-input
            v-model="dto.nutrition.carbonhydrate"
            :placeholder="placeholderNutrition('carbonhydrate')"
          />
        </div>
        <div>
          <div class="form-input-title">davon Zucker</div>
          <vm-input
            v-model="dto.nutrition.sugar"
            :placeholder="placeholderNutrition('sugar')"
          />
        </div>
        <div>
          <div class="form-input-title">Eiweiß</div>
          <vm-input
            v-model="dto.nutrition.protein"
            :placeholder="placeholderNutrition('protein')"
          />
        </div>
        <div>
          <div class="form-input-title">Salz</div>
          <vm-input
            v-model="dto.nutrition.salt"
            :placeholder="placeholderNutrition('salt')"
          />
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
        <vm-input
          :placeholder="placeholderImage(index, 'name')"
          v-model="dto.images[index].name"
        />
        <vm-input
          :placeholder="placeholderImage(index, 'src')"
          v-model="dto.images[index].src"
        />
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
      <vm-dialog-button title="Speichern" @click="updateProduct" />
    </template>
  </vm-dialog>
</template>

<script lang="ts">
import backend from '@/utils/Backend';
import { Product, ProductManager } from '@/utils/ProductManager';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class BHDialogEditProduct extends Vue {
  public key = 'dialog_edit_product';
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
  public product: Product | null = null;

  public setDto(): void {
    this.product = this.$store.state.product;
    if (this.product) {
      this.dto.images = [];
      this.dto.ingredients = [];
      const { name, price, description, deliveryTime, images, ingredients } =
        this.product;
      if (name) this.dto.name = name;
      if (price) this.dto.price = price;
      if (description) this.dto.description = description;
      if (deliveryTime) this.dto.deliveryTime = deliveryTime;
      if (images) images.forEach((x) => this.dto.images.push({ ...x }));
      if (ingredients)
        ingredients.forEach((x) => this.dto.ingredients.push({ ...x }));
      Object.entries(this.product.nutrition).forEach(([key, value]) => {
        (this.dto.nutrition as Record<string, string>)[key] = value;
      });
    } else this.close();
  }

  public async updateProduct(): Promise<void> {
    if (!this.product) return;
    const { data } = await backend.patch(
      'product/' + this.product.bakeryId + '/' + this.product.id,
      this.dto
    );
    ProductManager.storeProducts([data]);
  }

  mounted(): void {
    this.$router.afterEach(() => {
      this.close();
    });
  }

  public close(): void {
    this.$store.commit(this.key, false);
  }

  public placeholderImage(index: number, key: 'name' | 'src'): string {
    const defaults = { src: 'URL', name: 'Beschreibung' };

    if (this.product && this.product.images && this.product.images[index]) {
      const val = this.product.images[index][key];
      if (val) return val;
    }
    return defaults[key];
  }

  public placeholderNutrition(key: string): string {
    const defaults: Record<string, string> = {
      energy: '1337kcal',
      fat: '6g',
      saturates: '1.4g',
      carbonhydrate: '62.8g',
      sugar: '1.3g',
      protein: '13g',
      salt: '2g',
    };

    if (this.product && this.product.nutrition) {
      const val = (this.product.nutrition as Record<string, string>)[key];
      if (val) return val;
    }
    return defaults[key];
  }

  public placeholderIngredient(index: number, key: 'amount' | 'name'): string {
    const defaults = { amount: 'Menge', name: 'Beschreibung' };
    if (
      this.product &&
      this.product.ingredients &&
      this.product.ingredients[index]
    ) {
      const val = this.product.ingredients[index][key];
      if (val) return val;
    }
    return defaults[key];
  }
}
</script>

<style lang="scss" scoped>
.bh-dialog-edit-product {
  //
}
</style>
