let news = [];
let menus = document.querySelectorAll('#menu-list button');
let searchButton = document.getElementById('search-button');
let url;

let page = 1;
let totalPage = 1;

//각 함수에서 필요한 url을 만든다
//api호출 함수를 부른다.
const getNews = async () => {
   try {
      let header = new Headers({
         'x-api-key': 'gmvNFVOLL1y8thkxImdl51ZrqxsRZF7GTE6a9_fhRG8',
      });
      url.searchParams.set('page', page); //&page=
      let response = await fetch(url, { headers: header });
      let data = await response.json();
      totalPage = data.total_pages;
      page = data.page;
      if (response.status == 200) {
         if (data.total_hits == 0) {
            throw new Error('검색된 결과값이 없습니다.');
         }
         news = data.articles;
         render();
         pagenation();
      } else {
         throw new Error(data.message);
      }
   } catch (error) {
      errorRender(error.message);
   }
};

const getLatestNews = async () => {
   url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=business&page_size=10`);
   getNews();
};

menus.forEach(menu => menu.addEventListener('click', event => getNewsByTopic(event)));
const getNewsByTopic = async event => {
   let topic = event.target.textContent.toLowerCase();
   page = 1;
   url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=10`);
   getNews();
};
const getNewsByKeyword = async () => {
   //1.검색 키워드 읽어오기
   //2. url에 검색 키워드 붙이기
   //3. 헤더 준비
   //4. url 부르기
   //5. 데이터 가져오기
   //6. 데이터 보여주기

   let keyword = document.getElementById('search-input').value;
   url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`);
   getNews();
};
const render = () => {
   let newsHTML = '';
   newsHTML = news
      .map(item => {
         return `<div class="row news">
    <div class="col-lg-4">
      <img class="news-img-size" src="${item.media}" alt="" />
    </div>
    <div class="col-lg-8">
      <h2>${item.title}</h2>
      <p>${item.summary}</p>
    </div>
    ${item.rights} *
    ${item.published_date}
  </div>`;
      })
      .join('');

   document.getElementById('news-board').innerHTML = newsHTML;
};

const errorRender = message => {
   let errorHTML = `
  <div class="alert alert-danger text-center alret-box" role="alert">
  ${message}
</div>`;
   document.getElementById('news-board').innerHTML = errorHTML;
};

//pagenation 버튼

const pagenation = () => {
   let pagenationHTML = ``;

   let pageGroup = Math.ceil(page / 5);
   let last = pageGroup * 5;
   if (last > totalPage) {
      last = totalPage;
   }

   let first = last - 4 <= 0 ? 1 : last - 4;

   if (first >= 6) {
      pagenationHTML = `
      <li class="page-item" onclick="pageClick(1)">
      <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
    </li>
    <li class="page-item" onclick="pageClick(${page - 1})">
      <a class="page-link" href='#js-bottom'>&lt;</a>
    </li>`;
   }

   for (let i = first; i <= last; i++) {
      pagenationHTML += ` <li class="page-item ${
         page == i ? 'active' : ''
      }"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
   }
   if (last < totalPage) {
      pagenationHTML += `
      <li class="page-item" onclick="pageClick(${page + 1})">
                        <a  class="page-link" href='#js-program-detail-bottom'>&gt;</a>
                       </li>
                       <li class="page-item" onclick="pageClick(${totalPage})">
                        <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                       </li>`;
   }

   document.querySelector('.pagination').innerHTML = pagenationHTML;
};
const moveToPage = pageNum => {
   //1. 이동하고싶은 페이지 알아야함
   page = pageNum;
   window.scrollTo({ top: 0, behavior: 'smooth' });

   //2. 이동하고싶은 페이지를가지고 api를 다시 호출한다.
   getNews();
};

const openNav = () => {
   document.getElementById('slide-nav').style.width = '250px';
};
const closeNav = () => {
   document.getElementById('slide-nav').style.width = '0';
};

searchButton.addEventListener('click', getNewsByKeyword);
getLatestNews();
