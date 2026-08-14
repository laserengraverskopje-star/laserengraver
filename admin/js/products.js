const ADMIN_USERNAME = "sharkylive";
const ADMIN_PASSWORD = "SharkyLive@50";

if (sessionStorage.getItem("adminLogged") !== "true") {
  location.href = "login.html";
}

const assets = {
  gallery1: [
    'images/galerija 1/1.jpg',
    'images/galerija 1/2.jpg',
    'images/galerija 1/3.jpg',
    'images/galerija 1/4.jpg',
    'images/galerija 1/5.jpg',
    'images/galerija 1/6.jpg',
    'images/galerija 1/7.jpg',
    'images/galerija 1/10.jpg',
    'images/galerija 1/11.jpg',
    'images/galerija 1/12.jpg',
    'images/galerija 1/15.jpg',
    'images/galerija 1/16.jpg',
    'images/galerija 1/17.jpg',
    'images/galerija 1/18.jpg',
    'images/galerija 1/19.jpg',
    'images/galerija 1/20.jpg',
    'images/galerija 1/24.jpg',
    'images/galerija 1/26.jpg',
    'images/galerija 1/27.jpg',
    'images/galerija 1/28.jpg',
    'images/galerija 1/29.jpg',
    'images/galerija 1/30.jpg',
    'images/galerija 1/31.jpg',
    'images/galerija 1/32.jpg',
    'images/galerija 1/33.jpg',
    'images/galerija 1/34.jpg',
    'images/galerija 1/35.jpg',
    'images/galerija 1/36.jpg',
    'images/galerija 1/37.jpg',
    'images/galerija 1/38.jpg',
    'images/galerija 1/39.jpg',
    'images/galerija 1/40.jpg',
    'images/galerija 1/41.jpg',
    'images/galerija 1/42.jpg',
    'images/galerija 1/43.jpg',
    'images/galerija 1/44.jpg',
    'images/galerija 1/45.jpg',
    'images/galerija 1/46.jpg',
    'images/galerija 1/47.jpg',
    'images/galerija 1/48.jpg',
    'images/galerija 1/49.jpg',
    'images/galerija 1/50.jpg',
    'images/galerija 1/51.jpg',
    'images/galerija 1/52.jpg',
    'images/galerija 1/53.jpg',
    'images/galerija 1/54.jpg',
    'images/galerija 1/55.jpg',
    'images/galerija 1/56.jpg',
    'images/galerija 1/57.jpg',
    'images/galerija 1/58.jpg',
    'images/galerija 1/59.jpg',
    'images/galerija 1/60.jpg',
    'images/galerija 1/61.jpg',
    'images/galerija 1/62.jpg',
    'images/galerija 1/63.jpg',
    'images/galerija 1/64.jpg',
    'images/galerija 1/65.jpg',
    'images/galerija 1/66.jpg',
    'images/galerija 1/67.jpg',
    'images/galerija 1/68.jpg',
    'images/galerija 1/69.jpg',
    'images/galerija 1/70.jpg',
    'images/galerija 1/71.jpg',
    'images/galerija 1/72.jpg',
    'images/galerija 1/73.jpg',
    'images/galerija 1/74.jpg',
    'images/galerija 1/75.jpg',
    'images/galerija 1/76.jpg',
    'images/galerija 1/77.jpg',
    'images/galerija 1/78.jpg',
    'images/galerija 1/79.jpg',
    'images/galerija 1/80.jpg',
    'images/galerija 1/81.jpg',
    'images/galerija 1/82.jpg',
    'images/galerija 1/83.jpg',
    'images/galerija 1/84.jpg',
  ],

  gallery2: [
    'images/galerija 2/85.jpg',
    'images/galerija 2/86.jpg',
    'images/galerija 2/87.jpg',
    'images/galerija 2/88.jpg',
    'images/galerija 2/89.jpg',
    'images/galerija 2/90.jpg',
    'images/galerija 2/91.jpg',
    'images/galerija 2/92.jpg',
    'images/galerija 2/93.jpg',
    'images/galerija 2/94.jpg',
    'images/galerija 2/95.jpg',
    'images/galerija 2/96.jpg',
    'images/galerija 2/97.jpg',
    'images/galerija 2/98.jpg',
    'images/galerija 2/99.jpg',
    'images/galerija 2/100.jpg',
    'images/galerija 2/101.jpg',
    'images/galerija 2/102.jpg',
    'images/galerija 2/103.jpg',
    'images/galerija 2/104.jpg',
    'images/galerija 2/105.jpg',
    'images/galerija 2/106.jpg',
    'images/galerija 2/107.jpg',
    'images/galerija 2/108.jpg',
    'images/galerija 2/109.jpg',
    'images/galerija 2/110.jpg',
    'images/galerija 2/111.jpg',
    'images/galerija 2/112.jpg',
    'images/galerija 2/113.jpg',
    'images/galerija 2/114.jpg',
    'images/galerija 2/115.jpg',
    'images/galerija 2/116.jpg',
    'images/galerija 2/117.jpg',
    'images/galerija 2/118.jpg',
    'images/galerija 2/119.jpg',
    'images/galerija 2/120.jpg',
    'images/galerija 2/121.jpg',
    'images/galerija 2/122.jpg',
    'images/galerija 2/123.jpg',
    'images/galerija 2/124.jpg',
    'images/galerija 2/125.jpg',
    'images/galerija 2/126.jpg',
    'images/galerija 2/127.jpg',
    'images/galerija 2/128.jpg',
    'images/galerija 2/129.jpg',
    'images/galerija 2/130.jpg',
    'images/galerija 2/131.jpg',
    'images/galerija 2/132.jpg',
    'images/galerija 2/133.jpg',
    'images/galerija 2/134.jpg',
    'images/galerija 2/135.jpg',
    'images/galerija 2/136.jpg',
    'images/galerija 2/137.jpg',
    'images/galerija 2/138.jpg',
    'images/galerija 2/139.jpg',
    'images/galerija 2/140.jpg',
    'images/galerija 2/141.jpg',
    'images/galerija 2/142.jpg',
    'images/galerija 2/143.jpg',
    'images/galerija 2/144.jpg',
    'images/galerija 2/145.jpg',
    'images/galerija 2/146.jpg',
    'images/galerija 2/147.jpg',
    'images/galerija 2/148.jpg',
    'images/galerija 2/149.jpg',
    'images/galerija 2/150.jpg',
    'images/galerija 2/151.jpg',
    'images/galerija 2/152.jpg',
    'images/galerija 2/153.jpg',
    'images/galerija 2/154.jpg',
    'images/galerija 2/155.jpg',
    'images/galerija 2/156.jpg',
    'images/galerija 2/157.jpg',
    'images/galerija 2/158.jpg',
    'images/galerija 2/159.jpg',
    'images/galerija 2/160.jpg',
    'images/galerija 2/161.jpg',
    'images/galerija 2/162.jpg',
    'images/galerija 2/163.jpg',
  ]
};

const categories = [
  'Метал','Дрво','Стакло','Кожа','Плексиглас','Пластика','Трофеи','Подароци',
  'Привезоци','Таблички','Плакети','Свадби','Родендени','Бизнис Подароци','Персонализирани'
];

let currentGallery = 'gallery1';
let catalogRows = [];

function escapeHtml(v){
  return String(v ?? '').replace(/[&<>'"]/g, c => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    "'":'&#39;',
    '"':'&quot;'
  }[c]));
}

function escapeAttr(v){
  return escapeHtml(v);
}

function pathLabel(path){
  return path.replace(/^images\//,'');
}

function slotFromPath(path){
  const m = String(path).match(/galerija\s*([12])\/(\d+)\./i);
  return m
    ? {
        gallery:m[1] === '2' ? 'gallery2' : 'gallery1',
        slot:Number(m[2])
      }
    : null;
}

function slotId(gallery, slot){
  return (gallery === 'gallery2' ? 'g2-' : 'g1-') + slot;
}

function optionsForGallery(gallery, selected){
  return assets[gallery]
    .map(path =>
      `<option value="${escapeAttr(path)}" ${path===selected?'selected':''}>${escapeHtml(pathLabel(path))}</option>`
    )
    .join('');
}

function categoryOptions(selected){
  return '<option value="">Избери категорија</option>' +
    categories
      .map(c =>
        `<option value="${escapeAttr(c)}" ${c===selected?'selected':''}>${escapeHtml(c)}</option>`
      )
      .join('');
}

function getRow(slotId){
  return catalogRows.find(r => r.slot_id === slotId) || {};
}

function getSlots(gallery) {
    const slots = assets[gallery].map(path => {
        const info = slotFromPath(path);

        return {
            slot: info.slot,
            defaultPath: path,
            slotId: slotId(gallery, info.slot)
        };
    });

    // Додади ги и производите што веќе постојат во базата,
    // а немаат фиксна слика во assets.
    const catalogSlots = catalogRows
        .filter(row => {
            return row &&
                row.gallery === gallery &&
                row.slot_id;
        })
        .map(row => {
            const parts = String(row.slot_id).split('-');
            const slotNumber = Number(parts[parts.length - 1]);

            return {
                slot: slotNumber,
                defaultPath: '',
                slotId: row.slot_id
            };
        })
        .filter(item => Number.isFinite(item.slot));

    // Спои ги фиксните и динамичките производи без дупликати.
    const existingIds = new Set(slots.map(item => item.slotId));

    catalogSlots.forEach(item => {
        if (!existingIds.has(item.slotId)) {
            slots.push(item);
            existingIds.add(item.slotId);
        }
    });

    // Сортирај ги по реден број.
    slots.sort((a, b) => a.slot - b.slot);

    // Најди го последниот постоечки slot.
    const existingNumbers = slots
        .map(item => Number(item.slot))
        .filter(Number.isFinite);

    const maxSlot = existingNumbers.length
        ? Math.max(...existingNumbers)
        : 0;

    // Секогаш прикажи ЕДЕН следен празен slot.
    const nextSlot = maxSlot + 1;

    slots.push({
        slot: nextSlot,
        defaultPath: '',
        slotId: slotId(gallery, nextSlot)
    });

    return slots;
}


function getExtraImages(row) {
  if (!row || row.extra_images == null) return [];

  if (Array.isArray(row.extra_images)) {
    return row.extra_images.filter(Boolean).slice(0, 3);
  }

  try {
    const parsed = JSON.parse(String(row.extra_images));
    if (Array.isArray(parsed)) {
      return parsed.filter(Boolean).slice(0, 3);
    }
  } catch (_) {}

  return String(row.extra_images)
    .split('|')
    .map(v => v.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function renderExtraPictures(dom, extraImages) {
  return [0, 1, 2].map(index => {
    const path = extraImages[index] || '';
    const preview = getImageUrl(path);

    return `
      <div class="extra-picture">
        <div style="font-weight:600;margin-bottom:6px;">
          Дополнителна слика ${index + 1}
        </div>

        <img
          id="extra-preview-${dom}-${index}"
          src="${escapeAttr(preview)}"
          alt="Дополнителна слика ${index + 1}"
          style="width:100%;height:140px;object-fit:contain;border-radius:8px;background:#111;margin-bottom:8px;"
        >

        <input
          type="hidden"
          id="extra-image-${dom}-${index}"
          value="${escapeAttr(path)}"
        >

        <input
          type="file"
          id="extra-upload-${dom}-${index}"
          accept="image/jpeg,image/png,image/webp"
          onchange="uploadExtraProductImage('${dom}',${index})"
        >

        <button
          type="button"
          onclick="clearExtraProductImage('${dom}',${index})"
          style="margin-top:6px;"
        >
          Отстрани слика
        </button>
      </div>
    `;
  }).join('');
}

function collectExtraImages(dom) {
  return [0, 1, 2]
    .map(index => {
      const el = document.getElementById(`extra-image-${dom}-${index}`);
      return el ? el.value.trim() : '';
    })
    .filter(Boolean);
}

async function uploadExtraProductImage(dom, index) {
  const input =
    document.getElementById(`extra-upload-${dom}-${index}`);

  const file =
    input?.files?.[0];

  if (!file) return;

  const status =
    document.getElementById(`status-${dom}`);

  try {
    status.textContent =
      `Прикачување на дополнителна слика ${index + 1}...`;

    status.className =
      'status';

    const token =
      sessionStorage.getItem('adminToken');

    if (!token) {
      throw new Error(
        'Сесијата е истечена. Најави се повторно.'
      );
    }

    const formData =
      new FormData();

    formData.append(
      'image',
      file
    );

    const res =
      await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'Authorization':
            `Bearer ${token}`
        },
        body: formData
      });

    const data =
      await res.json();

    if (!res.ok || !data.success) {
      throw new Error(
        data.error ||
        'Грешка при прикачување.'
      );
    }

    const imageInput =
      document.getElementById(
        `extra-image-${dom}-${index}`
      );

    const preview =
      document.getElementById(
        `extra-preview-${dom}-${index}`
      );

    imageInput.value =
      data.image_path;

    preview.src =
      getImageUrl(data.image_path);

    status.textContent =
      `✓ Дополнителната слика ${index + 1} е прикачена`;

    status.className =
      'status saved';

  } catch (err) {

    console.error(err);

    status.textContent =
      '✕ ' + err.message;

    status.className =
      'status error';
  }

  input.value = '';
}

function clearExtraProductImage(dom, index) {
  const imageInput =
    document.getElementById(
      `extra-image-${dom}-${index}`
    );

  const preview =
    document.getElementById(
      `extra-preview-${dom}-${index}`
    );

  if (imageInput) {
    imageInput.value = '';
  }

  if (preview) {
    preview.src = '';
  }
}

window.uploadExtraProductImage =
  uploadExtraProductImage;

window.clearExtraProductImage =
  clearExtraProductImage;

async function deleteProduct(id, dom) {
  if (!id) return;

  const p =
    getRow(id);

  const productName =
    p.name?.trim() || `позиција ${id}`;

  const confirmed =
    confirm(
      `Дали сигурно сакаш да го избришеш производот "${productName}"?\n\nОва ќе ги избрише податоците за овој артикл од каталогот.`
    );

  if (!confirmed) return;

  const status =
    document.getElementById(`status-${dom}`);

  if (status) {
    status.textContent =
      'Бришење...';

    status.className =
      'status';
  }

  try {
    const token =
      sessionStorage.getItem('adminToken');

    if (!token) {
      throw new Error(
        'Сесијата е истечена. Најави се повторно.'
      );
    }

    const res =
      await fetch('/api/products', {
        method: 'DELETE',
        headers: {
          'Content-Type':
            'application/json'
        },
        body: JSON.stringify({
          token,
          slot_id: id
        })
      });

    const responseText = await res.text();
    let data = {};

    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (_) {
      throw new Error(
        `Серверот врати невалиден одговор (${res.status}).`
      );
    }

    if (!res.ok || !data.success) {
      throw new Error(
        data.error ||
        'Грешка при бришење.'
      );
    }

    catalogRows =
      catalogRows.filter(
        r => r.slot_id !== id
      );

    render();

  } catch (err) {

    console.error(err);

    if (status) {
      status.textContent =
        '✕ ' + err.message;

      status.className =
        'status error';
    }
  }
}

window.deleteProduct =
  deleteProduct;

function render(){
  const container = document.getElementById('products');
  const q = document.getElementById('search').value.toLowerCase().trim();
  const cat = document.getElementById('categoryFilter').value;
  const slots = getSlots(currentGallery);

  container.innerHTML = slots.map((slot, index) => {
    const p = getRow(slot.slotId);
    const imagePath = p.image_path || slot.defaultPath;
    const imageUrl = getImageUrl(imagePath);
    const category = p.category || '';
    const name = p.name || '';
    const price = p.price || '';
    const desc = p.description || '';
    const extraImages = getExtraImages(p);
    const hasSavedProduct = Boolean(p.slot_id);

    const haystack =
      `${pathLabel(imagePath)} ${name} ${category} ${price} ${desc}`.toLowerCase();

    if ((q && !haystack.includes(q)) || (cat && category !== cat)) return '';

    const dom = `${currentGallery}-${slot.slot}`;

    return `
      <article class="product" data-dom="${dom}">
        <img
          id="preview-${dom}"
          src="${escapeAttr(imageUrl)}"
          alt="${escapeAttr(name || 'Производ')}"
          loading="lazy"
        >

        <div class="slot">
          Позиција:
          ${currentGallery === 'gallery2' ? 'Галерија 2' : 'Галерија 1'}
          / ${slot.slot}
        </div>

        <label>Слика</label>

        <input
          type="hidden"
          id="image-${dom}"
          value="${escapeAttr(imagePath)}"
        >

        <input
          type="file"
          id="upload-${dom}"
          accept="image/jpeg,image/png,image/webp"
          onchange="uploadProductImage('${dom}')"
        >

        <div style="margin-top:16px;">
          <label>Дополнителни слики</label>

          <div
            style="
              display:grid;
              grid-template-columns:repeat(3,minmax(0,1fr));
              gap:10px;
              margin-top:8px;
            "
          >
            ${renderExtraPictures(dom, extraImages)}
          </div>

          <small style="display:block;margin-top:8px;opacity:.7;">
            Додај до 3 дополнителни слики од други агли или детали на производот.
          </small>
        </div>

        <div class="grid-two">

          <div>
            <label>Категорија</label>
            <select id="category-${dom}">
              ${categoryOptions(category)}
            </select>
          </div>

          <div>
            <label>Производ / име</label>
            <input
              id="name-${dom}"
              value="${escapeAttr(name)}"
              placeholder="Пример: Дрвена плакета"
            >
          </div>

        </div>

        <label>Цена</label>

        <input
          id="price-${dom}"
          value="${escapeAttr(price)}"
          placeholder="Пример: 500 ден."
        >

        <label>Опис</label>

        <textarea
          id="desc-${dom}"
          placeholder="Краток опис на производот..."
        >${escapeHtml(desc)}</textarea>

        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">

          <button
            class="save"
            onclick="saveProduct('${dom}','${slot.slotId}','${currentGallery}',${slot.slot})"
          >
            Зачувај
          </button>

          ${hasSavedProduct ? `
            <button
              type="button"
              onclick="deleteProduct('${slot.slotId}','${dom}')"
              style="
                background:#b42318;
                color:#fff;
                border:0;
                border-radius:8px;
                padding:10px 16px;
                cursor:pointer;
                font-weight:600;
              "
            >
              Избриши
            </button>
          ` : ''}

        </div>

        <div class="status" id="status-${dom}"></div>

      </article>`;
  }).join('');
}


function getImageUrl(path) {
  path = (path || '').trim();

  if (!path) return '';

  // R2 image through Pages Function
  if (path.startsWith('/api/images/')) {
    return path;
  }

  if (path.startsWith('api/images/')) {
    return '/' + path;
  }

  // Direct full URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Old/local images
  if (path.startsWith('/images/')) {
    return path;
  }

  if (path.startsWith('images/')) {
    return '/' + path;
  }

  return '/images/' + path;
}

function previewImage(dom) {
    const path = document.getElementById(`image-${dom}`).value;

    document.getElementById(`preview-${dom}`).src =
      getImageUrl(path);
}

window.previewImage = previewImage;

async function uploadProductImage(dom) {

    const input =
      document.getElementById(`upload-${dom}`);

    const file =
      input.files[0];

    if (!file) return;

    const status =
      document.getElementById(`status-${dom}`);

    try {

        status.textContent =
          'Прикачување на сликата...';

        status.className =
          'status';

        const token =
          sessionStorage.getItem('adminToken');

        if (!token) {
            throw new Error(
              'Сесијата е истечена. Најави се повторно.'
            );
        }

        const formData =
          new FormData();

        formData.append(
          'image',
          file
        );

        const res =
          await fetch('/api/upload-image', {
            method: 'POST',
            headers: {
                'Authorization':
                  `Bearer ${token}`
            },
            body: formData
          });

        const data =
          await res.json();

        if (!res.ok || !data.success) {
            throw new Error(
              data.error ||
              'Грешка при прикачување.'
            );
        }

        const imageInput =
          document.getElementById(`image-${dom}`);

        imageInput.value =
          data.image_path;

        previewImage(dom);

        status.textContent =
          '✓ Сликата е прикачена';

        status.className =
          'status saved';

    } catch (err) {

        console.error(err);

        status.textContent =
          '✕ ' + err.message;

        status.className =
          'status error';
    }

    input.value = '';
}

window.uploadProductImage =
  uploadProductImage;

async function saveProduct(dom, id, gallery, slot) {

  const status =
    document.getElementById(`status-${dom}`);

  status.textContent =
    'Зачувување...';

  status.className =
    'status';

  try {

    const token =
      sessionStorage.getItem('adminToken');

    if (!token) {
      throw new Error(
        'Сесијата е истечена. Најави се повторно.'
      );
    }

    const imagePath =
      document
        .getElementById(`image-${dom}`)
        .value
        .trim();

    const res =
      await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json'
        },
        body: JSON.stringify({

          token,

          slot_id: id,

          gallery,

          slot,

          image_path: imagePath,

          category:
            document
              .getElementById(`category-${dom}`)
              .value
              .trim(),

          name:
            document
              .getElementById(`name-${dom}`)
              .value
              .trim(),

          price:
            document
              .getElementById(`price-${dom}`)
              .value
              .trim(),

          description:
            document
              .getElementById(`desc-${dom}`)
              .value
              .trim(),

          extra_images:
            collectExtraImages(dom)
        })
      });

    const data =
      await res.json();

    if (!res.ok || !data.success) {
      throw new Error(
        data.error ||
        'Грешка при зачувување.'
      );
    }

    const existing =
      getRow(id);

    const updated = {

      ...existing,

      slot_id: id,

      gallery,

      slot,

      image_path: imagePath,

      category:
        document
          .getElementById(`category-${dom}`)
          .value
          .trim(),

      name:
        document
          .getElementById(`name-${dom}`)
          .value
          .trim(),

      price:
        document
          .getElementById(`price-${dom}`)
          .value
          .trim(),

      description:
        document
          .getElementById(`desc-${dom}`)
          .value
          .trim(),

      extra_images:
        collectExtraImages(dom)
    };

    catalogRows =
      catalogRows.filter(
        r => r.slot_id !== id
      );

    catalogRows.push(
      updated
    );

    document.getElementById(
      `preview-${dom}`
    ).src =
      getImageUrl(imagePath);

    status.textContent =
      '✓ Зачувано';

    status.className =
      'status saved';

  } catch (err) {

    console.error(err);

    status.textContent =
      '✕ ' + err.message;

    status.className =
      'status error';
  }
}

window.saveProduct =
  saveProduct;

function updateCategoryFilter(){

  const select =
    document.getElementById(
      'categoryFilter'
    );

  const selected =
    select.value;

  select.innerHTML =
    '<option value="">Сите категории</option>' +
    categories
      .map(c =>
        `<option value="${escapeAttr(c)}">${escapeHtml(c)}</option>`
      )
      .join('');

  select.value =
    selected;
}

document
  .querySelectorAll('.tab')
  .forEach(tab =>
    tab.addEventListener(
      'click',
      () => {

        document
          .querySelectorAll('.tab')
          .forEach(t =>
            t.classList.remove('active')
          );

        tab.classList.add('active');

        currentGallery =
          tab.dataset.gallery;

        render();
      }
    )
  );

document
  .getElementById('search')
  .addEventListener(
    'input',
    render
  );

document
  .getElementById('categoryFilter')
  .addEventListener(
    'change',
    render
  );

updateCategoryFilter();

fetch(
  '/api/products',
  {
    cache:'no-store'
  }
)
.then(
  r =>
    r.ok
      ? r.json()
      : []
)
.then(
  rows => {

    catalogRows =
      rows || [];

    render();
  }
)
.catch(
  () => {

    catalogRows = [];

    render();
  }
);