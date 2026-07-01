import { MenuVersion } from './menu.schema';

export const DEFAULT_MENU_SLUG = 'auren';

export const defaultAurenMenu = {
  brandName: 'Áuren',
  subtitle: 'Gastronomy',
  categories: [
    {
      title: 'Sugerencias',
      icon: 'cloche',
      visible: true,
      sortOrder: 10,
      products: [
        {
          name: 'Roll de Tortilla Gourmet',
          description: 'Tortilla de trigo finamente enrollada, rellena de cerdo ahumado jugoso y selectos ingredientes.',
          priceCop: 20000,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 10
        },
        {
          name: 'Ciotola di Mair',
          description: 'Mazorcada con ternera, pollo dorado y maíz en mantequilla gratinado.',
          priceCop: 25000,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 20
        },
        {
          name: 'Tabla de Carnes',
          description: 'Composición de carne, pollo y costilla, acompañada de chorizo, papa francesa y papa criolla.',
          priceCop: 30000,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 30
        },
        {
          name: 'Patacón Auren',
          description: 'Plátano al gusto, coronado a tu degustación.',
          priceCop: 23000,
          variants: [
            { name: 'Pollo', priceCop: 23000, visible: true, sortOrder: 10 },
            { name: 'Carne', priceCop: 25000, visible: true, sortOrder: 20 },
            { name: 'Mixto', priceCop: 28000, visible: true, sortOrder: 30 },
            { name: 'Camarones', priceCop: 35000, visible: true, sortOrder: 40 }
          ],
          visible: true,
          available: true,
          sortOrder: 40
        }
      ]
    },
    {
      title: 'Papas del Chef',
      icon: 'fries',
      visible: true,
      sortOrder: 20,
      products: [
        {
          name: 'Papas Urban',
          description: 'Papa francesa, cubierta de salchicha y chorizo, gratinada en salsa de maíz con queso.',
          priceCop: 20000,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 10
        },
        {
          name: 'Pápate Croccanti',
          description: 'Papa francesa y rústica al ajillo, salchicha, chorizo, ternera, gratinado en salsa de queso y guacamole.',
          priceCop: 25000,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 20
        },
        {
          name: 'Rustico Italiano',
          description: 'Papa rústica al ajillo cubierta de salchicha, tocino crocante y pollo dorado, gratinado en crema de maíz a la parmesana.',
          priceCop: 30000,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 30
        },
        {
          name: 'Salsiccia House',
          description: 'Papa francesa y criolla al perejil, cubierta de maduro, ternera, cerdo ahumado, gratinado en crema de queso y pico de gallo.',
          priceCop: 35000,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 40
        }
      ]
    },
    {
      title: 'Burgers',
      icon: 'burger',
      visible: true,
      sortOrder: 30,
      products: [
        {
          name: 'Ternera',
          description: 'Pan ligeramente sellado a la parrilla, con 130g de carne jugosa, gratinado americano y vegetales frescos de nuestra huerta.',
          priceCop: 13000,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 10
        },
        {
          name: 'Urban',
          description: 'Carne 130g a la parrilla, champiñones salteados con mantequilla de ajo, reducción de queso gruyere y vegetales frescos.',
          priceCop: 16000,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 20
        },
        {
          name: 'Vegana',
          description: 'Mezcla jugosa de legumbres y vegetales frescos, sazonada en especias selectas y cocinada a la perfección.',
          priceCop: 16000,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 30
        },
        {
          name: 'Auren',
          description: 'Carne 130g jugosa sellada a la parrilla, bañada en napolitana a la parmesana, 100g de tocino ahumado y vegetales frescos.',
          priceCop: 20000,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 40
        },
        {
          name: 'Selecta',
          description: 'Carne 130g jugosa sellada a la parrilla, gratinada en queso americano, toque dulce con tostones de maduro, cerdo ahumado y vegetales.',
          priceCop: 22000,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 50
        },
        {
          name: 'Imperiale',
          description: 'Carne 130g jugosa sellada a la parrilla, gratinada en queso madurado, salami americano, napolitana italiana, huevo fundido y vegetales.',
          priceCop: 24000,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 60
        },
        {
          name: 'Elite',
          description: 'Carne de ternera 260g, chorizo curado con pimentón dulce, 100g de tocino ahumado, chimichurri y vegetales de nuestra huerta.',
          priceCop: 26000,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 70
        },
        {
          name: 'Siciliana',
          description: 'Carne 130g jugosa sellada a la parrilla, gratinada en crema de maíz dulce, pavo ahumado y vegetales de nuestra huerta.',
          priceCop: 35000,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 80
        }
      ]
    },
    {
      title: 'Adicionales',
      icon: 'plus',
      visible: true,
      sortOrder: 40,
      products: [
        {
          name: 'Papa Francesa',
          description: '',
          priceCop: 4000,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 10
        },
        {
          name: 'Papa Rústica al Ajillo',
          description: '',
          priceCop: 4000,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 20
        },
        {
          name: 'Papa Criolla al Ajillo',
          description: '',
          priceCop: 4000,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 30
        }
      ]
    },
    {
      title: 'Pollo Reale',
      icon: 'cloche',
      visible: true,
      sortOrder: 50,
      products: [
        {
          name: 'Pollo Dorado',
          description: 'Pechuga a la parrilla 400g.',
          priceCop: 0,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 10
        },
        {
          name: 'Pollo Gratin',
          description: 'Pechuga gratinada a la parrilla 400g.',
          priceCop: 0,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 20
        },
        {
          name: 'Pollo Mare Nostrum',
          description: 'Pechuga a la parrilla con crema de camarones frescos 400g.',
          priceCop: 0,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 30
        },
        {
          name: 'Pollo Creem',
          description: 'Pechuga a la parrilla reducida en crema de maíz.',
          priceCop: 0,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 40
        },
        {
          name: 'Costillas de Cerdo',
          description: 'Corte jugoso, blando y ahumado 400g.',
          priceCop: 0,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 50
        }
      ]
    },
    {
      title: 'Guarniciones',
      icon: 'plus',
      visible: true,
      sortOrder: 60,
      products: [
        {
          name: 'Papa Francesa',
          description: '',
          priceCop: 0,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 10
        },
        {
          name: 'Papa Criolla',
          description: '',
          priceCop: 0,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 20
        },
        {
          name: 'Papa Rústica',
          description: '',
          priceCop: 0,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 30
        },
        {
          name: 'Maduro con Requesón',
          description: '',
          priceCop: 0,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 40
        },
        {
          name: 'Ensalada',
          description: '',
          priceCop: 0,
          variants: [],
          visible: true,
          available: true,
          sortOrder: 50
        }
      ]
    }
  ]
} as unknown as MenuVersion;
