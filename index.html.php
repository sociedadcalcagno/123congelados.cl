<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Precios - Pasteleria</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
            --primary: #8B4513;
            --secondary: #D2691E;
            --accent: #FFB6C1;
            --cream: #FFF8DC;
            --chocolate: #3E2723;
            --gold: #DAA520;
            --light-bg: #FDF5E6;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background: var(--light-bg);
            background-image: 
                radial-gradient(circle at 20% 80%, rgba(139, 69, 19, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(210, 105, 30, 0.05) 0%, transparent 50%);
            min-height: 100vh;
            color: var(--chocolate);
        }

        .header {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            padding: 40px 20px;
            text-align: center;
            color: white;
            position: relative;
        }

        .header h1 {
            font-family: 'Playfair Display', serif;
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .header .subtitle { font-size: 1rem; opacity: 0.9; font-weight: 300; }
        .header .tagline { margin-top: 15px; font-size: 0.9rem; opacity: 0.85; font-style: italic; }

        .container { max-width: 1100px; margin: 0 auto; padding: 30px 20px; }

        .intro {
            text-align: center;
            margin-bottom: 40px;
            padding: 25px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(62, 39, 35, 0.1);
        }

        .intro p { color: #666; line-height: 1.7; }

        .edit-hint {
            background: linear-gradient(90deg, var(--gold), #F0E68C);
            color: var(--chocolate);
            padding: 12px 20px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 25px;
            font-size: 0.9rem;
            font-weight: 500;
            box-shadow: 0 2px 10px rgba(218, 165, 32, 0.3);
        }

        .edit-hint strong { color: var(--primary); }

        .section-title {
            font-family: 'Playfair Display', serif;
            font-size: 1.6rem;
            text-align: center;
            margin: 40px 0 25px;
            color: var(--primary);
        }

        .section-title::after {
            content: '';
            display: block;
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, var(--gold), var(--secondary));
            margin: 12px auto 0;
            border-radius: 2px;
        }

        .category { margin-bottom: 35px; }

        .category-name {
            font-family: 'Playfair Display', serif;
            font-size: 1.3rem;
            color: var(--secondary);
            margin-bottom: 18px;
            padding-bottom: 10px;
            border-bottom: 2px dashed var(--gold);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .category-icon { font-size: 1.5rem; }

        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 18px;
        }

        .product-card {
            background: white;
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 2px 12px rgba(62, 39, 35, 0.08);
            transition: all 0.3s ease;
            border: 2px solid transparent;
            position: relative;
        }

        .product-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(180deg, var(--gold), var(--secondary));
            opacity: 0;
            transition: opacity 0.3s;
            border-radius: 16px 0 0 16px;
        }

        .product-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(62, 39, 35, 0.15);
            border-color: var(--cream);
        }

        .product-card:hover::before { opacity: 1; }

        .product-name {
            font-weight: 600;
            font-size: 1rem;
            color: var(--chocolate);
            margin-bottom: 8px;
            line-height: 1.4;
            cursor: pointer;
            padding: 4px 8px;
            margin: -4px -8px 8px -8px;
            border-radius: 8px;
            transition: background 0.2s;
            border: 1px solid transparent;
        }

        .product-name:hover {
            background: #f5f5f5;
            border-color: #eee;
        }

        .product-name.editing {
            background: #fff9e6;
            border: 2px dashed var(--gold);
            outline: none;
        }

        .product-price {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary);
            cursor: pointer;
            padding: 4px 8px;
            margin: -4px -8px -8px -8px;
            border-radius: 8px;
            transition: background 0.2s;
            display: inline-block;
            border: 1px solid transparent;
        }

        .product-price:hover {
            background: #f5f5f5;
            border-color: #eee;
        }

        .product-price.editing {
            background: #fff9e6;
            border: 2px dashed var(--gold);
            outline: none;
        }

        .product-price input {
            font-family: inherit;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary);
            border: none;
            background: transparent;
            width: 120px;
            outline: none;
        }

        .product-name input {
            font-family: inherit;
            font-size: 1rem;
            font-weight: 600;
            color: var(--chocolate);
            border: none;
            background: transparent;
            width: 100%;
            outline: none;
        }

        .product-unit {
            font-size: 0.8rem;
            color: #888;
            margin-left: 4px;
        }

        .highlight-card {
            background: linear-gradient(135deg, var(--cream), white);
            border-color: var(--gold);
        }

        .badge {
            position: absolute;
            top: 12px;
            right: 12px;
            background: var(--gold);
            color: white;
            font-size: 0.7rem;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 20px;
            text-transform: uppercase;
        }

        .footer {
            text-align: center;
            padding: 40px 20px;
            margin-top: 40px;
            color: #888;
            font-size: 0.9rem;
        }

        .footer .brand {
            font-family: 'Playfair Display', serif;
            font-size: 1.2rem;
            color: var(--primary);
            margin-bottom: 10px;
        }

        @media (max-width: 600px) {
            .header h1 { font-size: 1.8rem; }
            .products-grid { grid-template-columns: 1fr; }
            .product-card { padding: 18px; }
            .big-price { font-size: 1.4rem; }
        }

        .price-tag { display: inline-flex; align-items: baseline; gap: 2px; }
        .big-price { font-size: 1.8rem; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🍰 Pastelería</h1>
        <div class="subtitle">Precios 2026</div>
        <div class="tagline">Delicias horneadas con amor</div>
    </div>

    <div class="container">
        <div class="edit-hint">
            ✏️ <strong>Click sobre el precio o nombre</strong> para editar. Los cambios se guardan automáticamente.
        </div>

        <h2 class="section-title">🥧 Tortas</h2>

        <div class="category">
            <div class="category-name">
                <span class="category-icon">🎂</span>
                Tortas de Milhoja
            </div>
            <div class="products-grid">
                <div class="product-card" data-product="torta-grande-milhoja">
                    <div class="product-name editable" data-field="nombre">Torta Grande de Milhoja</div>
                    <div class="product-price editable" data-field="precio">$65,000</div>
                </div>
                <div class="product-card" data-product="torta-mediana-milhoja">
                    <div class="product-name editable" data-field="nombre">Torta Mediana de Milhoja</div>
                    <div class="product-price editable" data-field="precio">$55,000</div>
                </div>
                <div class="product-card" data-product="torta-chica-milhoja">
                    <div class="product-name editable" data-field="nombre">Torta Chica de Milhoja</div>
                    <div class="product-price editable" data-field="precio">$45,000</div>
                </div>
            </div>
        </div>

        <div class="category">
            <div class="category-name">
                <span class="category-icon">🧁</span>
                Tortas de Pompadour
            </div>
            <div class="products-grid">
                <div class="product-card highlight-card" data-product="pompadour-grande">
                    <span class="badge">Popular</span>
                    <div class="product-name editable" data-field="nombre">Pompadour Grande</div>
                    <div class="product-price editable" data-field="precio">$70,000</div>
                </div>
                <div class="product-card" data-product="pompadour-mediana">
                    <div class="product-name editable" data-field="nombre">Pompadour Mediana</div>
                    <div class="product-price editable" data-field="precio">$60,000</div>
                </div>
            </div>
        </div>

        <h2 class="section-title">🍪 Salados</h2>

        <div class="category">
            <div class="category-name">
                <span class="category-icon">🥟</span>
                Empanadas & Canapés
            </div>
            <div class="products-grid">
                <div class="product-card" data-product="canapes">
                    <div class="product-name editable" data-field="nombre">Canapés</div>
                    <div class="product-price editable" data-field="precio">$50,000</div>
                    <span class="product-unit">x 100 unid.</span>
                </div>
                <div class="product-card" data-product="empanada-pino-queso">
                    <div class="product-name editable" data-field="nombre">Empanaditas de Cocktel de Pino y Queso</div>
                    <div class="product-price editable" data-field="precio">$40,000</div>
                    <span class="product-unit">x 100 unid.</span>
                </div>
                <div class="product-card" data-product="empanada-pino">
                    <div class="product-name editable" data-field="nombre">Empanaditas de Pino</div>
                    <div class="product-price editable" data-field="precio">$40,000</div>
                    <span class="product-unit">x 100 unid.</span>
                </div>
                <div class="product-card" data-product="peti-buche">
                    <div class="product-name editable" data-field="nombre">Peti Buché</div>
                    <div class="product-price editable" data-field="precio">$40,000</div>
                    <span class="product-unit">x 100 unid.</span>
                </div>
                <div class="product-card" data-product="choricillo">
                    <div class="product-name editable" data-field="nombre">Choricillo en Masa</div>
                    <div class="product-price editable" data-field="precio">$40,000</div>
                    <span class="product-unit">x 100 unid.</span>
                </div>
            </div>
        </div>

        <div class="category">
            <div class="category-name">
                <span class="category-icon">🍢</span>
                Brochetas
            </div>
            <div class="products-grid">
                <div class="product-card" data-product="brocheta-lomo">
                    <div class="product-name editable" data-field="nombre">Brocheta Lomo - Jamón - Piña</div>
                    <div class="product-price editable" data-field="precio">$45,000</div>
                </div>
                <div class="product-card highlight-card" data-product="brocheta-pollo">
                    <span class="badge">Premium</span>
                    <div class="product-name editable" data-field="nombre">Brocheta Filete Pollo</div>
                    <div class="product-price editable" data-field="precio">$70,000</div>
                </div>
            </div>
        </div>

        <div class="category">
            <div class="category-name">
                <span class="category-icon">🥮</span>
                Tartaletas
            </div>
            <div class="products-grid">
                <div class="product-card" data-product="tartaleta-fruta">
                    <div class="product-name editable" data-field="nombre">Tartaleta de Fruta</div>
                    <div class="product-price editable" data-field="precio">$40,000</div>
                </div>
                <div class="product-card" data-product="tapaditos">
                    <div class="product-name editable" data-field="nombre">Tapaditos (4 variedades)</div>
                    <div class="product-price editable" data-field="precio">$60,000</div>
                </div>
            </div>
        </div>

        <h2 class="section-title">🍕 Mini pizzas</h2>

        <div class="category">
            <div class="products-grid">
                <div class="product-card" data-product="mini-pizza">
                    <div class="product-name editable" data-field="nombre">Mini Pizza</div>
                    <div class="product-price editable" data-field="precio">$40,000</div>
                </div>
                <div class="product-card" data-product="pizzeta">
                    <div class="product-name editable" data-field="nombre">Pizzeta (Más grande)</div>
                    <div class="product-price editable" data-field="precio">$45,000</div>
                </div>
            </div>
        </div>

        <h2 class="section-title">🍩 Dulces</h2>

        <div class="category">
            <div class="category-name">
                <span class="category-icon">🧁</span>
                Dulces & Panqueques
            </div>
            <div class="products-grid">
                <div class="product-card" data-product="chilenitos">
                    <div class="product-name editable" data-field="nombre">Chilenitos Dulcecitos</div>
                    <div class="product-price editable" data-field="precio">$40,000</div>
                    <span class="product-unit">x 100 unid.</span>
                </div>
                <div class="product-card highlight-card" data-product="panqueque-naranja">
                    <span class="badge">Nueva</span>
                    <div class="product-name editable" data-field="nombre">Panqueque Naranja (Todas las tallas)</div>
                    <div class="product-price editable" data-field="precio">Misma variedad</div>
                    <div style="font-size: 0.8rem; color: #888;">Grande/Chico/Mediano</div>
                </div>
            </div>
        </div>

    </div>

    <div class="footer">
        <div class="brand">🍰 Pastelería</div>
        <p>Deliciosos productos horneados con los mejores ingredientes</p>
    </div>

    <script>
        const precios = {};

        document.querySelectorAll('.product-card').forEach(card => {
            const productId = card.dataset.product;
            precios[productId] = {};

            card.querySelectorAll('.editable').forEach(el => {
                const field = el.dataset.field;

                el.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (this.classList.contains('editing')) return;

                    this.classList.add('editing');
                    const currentValue = field === 'precio' 
                        ? this.textContent.replace(/[$,]/g, '').trim()
                        : this.textContent.trim();

                    const input = document.createElement('input');
                    input.type = field === 'precio' ? 'number' : 'text';
                    input.value = currentValue;

                    this.innerHTML = '';
                    this.appendChild(input);
                    input.focus();
                    input.select();

                    const guardar = () => {
                        const newValue = input.value.trim();
                        this.classList.remove('editing');

                        if (field === 'precio') {
                            const formatted = '$' + parseInt(newValue || 0).toLocaleString('es-CL');
                            this.innerHTML = formatted;
                            precios[productId].precio = formatted;
                        } else {
                            this.innerHTML = newValue;
                            precios[productId].nombre = newValue;
                        }

                        localStorage.setItem('precios_pasteleria', JSON.stringify(precios));

                        console.log('Guardado:', productId, field, newValue);
                    };

                    input.addEventListener('blur', guardar);
                    input.addEventListener('keydown', function(e) {
                        if (e.key === 'Enter') guardar();
                        if (e.key === 'Escape') {
                            this.classList.remove('editing');
                            this.innerHTML = field === 'precio' 
                                ? card.querySelector('.product-price').dataset.original || currentValue
                                : currentValue;
                        }
                    });
                });
            });
        });

        const guardados = localStorage.getItem('precios_pasteleria');
        if (guardados) {
            const preciosGuardados = JSON.parse(guardados);
            Object.keys(preciosGuardados).forEach(productId => {
                const card = document.querySelector(`[data-product="${productId}"]`);
                if (card && preciosGuardados[productId].precio) {
                    const precioEl = card.querySelector('.product-price');
                    if (precioEl) {
                        precioEl.dataset.original = preciosGuardados[productId].precio;
                        precioEl.textContent = preciosGuardados[productId].precio;
                    }
                }
                if (card && preciosGuardados[productId].nombre) {
                    const nombreEl = card.querySelector('.product-name');
                    if (nombreEl) nombreEl.textContent = preciosGuardados[productId].nombre;
                }
            });
        }
    </script>
</body>
</html>