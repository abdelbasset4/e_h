let data = [];
let montantTotal = document.querySelector('#montant-total p');
let montantPayee = document.querySelector('#montant-payee p');
let montantNonPayee = document.querySelector('#montant-no-payee p');
let montantRetenu = document.querySelector('#montant-retenu p');
let bigObj = JSON.parse(window.localStorage.getItem('bigObj')) ?? {
  All: {
    All: {
      montantTotalTtc: 0,
      montantTotalTtcPayye: 0,
      montantTotalTtcNonPayye: 0,
      montantTotalTtcRetenu: 0,
    },
  },
};


let RefreshBtn = document.querySelector('.refresh');

// remove the welcomming screen after loading the resources
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelector('.welcomming-screen').remove();
  }, 1500);
  //getDataAndCalc();
});

//window.onload = function(){
getDataAndCalc();
//}
// the functionality of sliding the filter screen
const filterScreen = document.querySelector('.filter-screen');
// back to main button functionality

// the functionality of clicking "les enterprise" button
const companiesButton = document.getElementById('companies-button');
const compteButton = document.getElementById('accounts-button');
companiesButton.addEventListener('click', () => {
  filterScreen.dataset.state = 'active';
  let agenceName = document.getElementById(
    'compte-status-description'
  ).textContent;
  // let arr = [...setData("name")];
  // if(agenceName !=="All"){

  //   arr = arr.filter(ele=>bigObj[ele].hasOwnProperty(agenceName));
  // }
  pushList(companiesButton.dataset.name, setData('name'));
});
compteButton.addEventListener('click', () => {
  filterScreen.dataset.state = 'active';
  let companyName = document.getElementById(
    'company-status-description'
  ).textContent;
  // let arr = [...setData("agence")];
  // if(companyName !=="All"){
  //    arr = arr.filter(ele=>bigObj[companyName].hasOwnProperty(ele));
  // }
  pushList(compteButton.dataset.name, setData('agence'));
});

async function getData() {
  // let response = await fetch('https://creation-app.com/creation-stats/index.php');
  let response = await fetch('http://192.168.1.5/creation-stats-app/index.php');
  data = await response.json();
}

function setData(type) {
  let setData = new Set();
  setData.add('All');
  data.forEach((ele) => {
    setData.add(ele[type]);
  });
  return setData;
}
function pushList(type, list) {
  let filterScreen = document.querySelector('.filter-screen');
  filterScreen.innerHTML = `<nav class="filter-screen__navigation">
  <button class="back-to-main">
    <img src="icons/Vector.svg" alt="back" />
  </button>
  <h2
    class="filter-screen__navigation__title fs-meduim fw-semi-bold"
  >
    Les ${type}
  </h2>
</nav>
`;

  let filterScreenList = document.createElement('ul');
  filterScreenList.classList.add(
    'filter-screen__list',
    'fs-small',
    'fw-semi-bold'
  );
  setData(type).forEach((element) => {
    let liItem = document.createElement('li');
    liItem.classList.add('filter-screen__list__item');
    liItem.textContent = element;
    liItem.addEventListener('click', (event) => {
      filterScreen.dataset.state = 'inactive';
      let companyStatus = document.getElementById(
        'company-status-description'
      );
      let compteStatus = document.getElementById(
        'compte-status-description'
      );
      if (type === 'name') {
        companyStatus.textContent = element;
        if (bigObj[element].hasOwnProperty(compteStatus.textContent)) {
          montantTotal.textContent = `${bigObj[element][
            compteStatus.textContent
          ]['montantTotalTtc'].toFixed(2)} DA`;
          montantPayee.textContent = `${bigObj[element][
            compteStatus.textContent
          ]['montantTotalTtcPayye'].toFixed(2)} DA`;
          montantNonPayee.textContent = `${bigObj[element][
            compteStatus.textContent
          ]['montantTotalTtcNonPayye'].toFixed(2)} DA`;
          montantRetenu.textContent = `${bigObj[element][
            compteStatus.textContent
          ]['montantTotalTtcRetenu'].toFixed(2)} DA`;
        } else {
          montantTotal.textContent = `0 DA`;
          montantPayee.textContent = `0 DA`;
          montantNonPayee.textContent = `0 DA`;
          montantRetenu.textContent = `0 DA`;
        }
      } else {
        compteStatus.textContent = element;
        if (bigObj[companyStatus.textContent].hasOwnProperty(element)) {
          montantTotal.textContent = `${bigObj[companyStatus.textContent][
            element
          ]['montantTotalTtc'].toFixed(2)} DA`;
          montantPayee.textContent = `${bigObj[companyStatus.textContent][
            element
          ]['montantTotalTtcPayye'].toFixed(2)} DA`;
          montantNonPayee.textContent = `${bigObj[
            companyStatus.textContent
          ][element]['montantTotalTtcNonPayye'].toFixed(2)} DA`;
          montantRetenu.textContent = `${bigObj[companyStatus.textContent][
            element
          ]['montantTotalTtcRetenu'].toFixed(2)} DA`;
        } else {
          montantTotal.textContent = `0 DA`;
          montantPayee.textContent = `0 DA`;
          montantNonPayee.textContent = `0 DA`;
          montantRetenu.textContent = `0 DA`;
        }
      }
      // }
    });
    filterScreenList.appendChild(liItem);
  });
  filterScreen.appendChild(filterScreenList);
  const backtoMainButton = document.querySelector('.back-to-main');
  backtoMainButton.addEventListener('click', () => {
    filterScreen.dataset.state = 'inactive';
  });
}
function getDataAndCalc() {
  document.getElementById('company-status-description').textContent =
    'All';
  document.getElementById('compte-status-description').textContent = 'All';
  let EntResult = setData('name');
  bigObj['All'] = {
    All: {
      montantTotalTtc: 0,
      montantTotalTtcPayye: 0,
      montantTotalTtcNonPayye: 0,
      montantTotalTtcRetenu: 0,
    },
  };
  EntResult.forEach((ele) => {
    bigObj[ele] = {
      All: {
        montantTotalTtc: 0,
        montantTotalTtcPayye: 0,
        montantTotalTtcNonPayye: 0,
        montantTotalTtcRetenu: 0,
      },
    };
    let accountSet = new Set(
      data
        .filter((eleFil) => eleFil.name === ele)
        .map((eleMap) => eleMap.agence)
    );
    accountSet.forEach((eleAcc) => {
      bigObj[ele][eleAcc] = {
        montantTotalTtc: parseFloat(
          data
            .filter(
              (eleAnnu) =>
                eleAnnu.annuler !== 'Annuler' && eleAnnu.agence === eleAcc
            )
            .map((eleMTtc) => eleMTtc.montant_ttc)
            .reduce((accu, current) => accu + parseFloat(current), 0)
            .toFixed(2)
        ),
        montantTotalTtcPayye: parseFloat(
          data
            .filter(
              (eleAnnu) =>
                eleAnnu.annuler !== 'Annuler' &&
                eleAnnu.agence === eleAcc &&
                eleAnnu.etat === 'Payée'
            )
            .map((eleMTtc) => eleMTtc.montant_ttc)
            .reduce((accu, current) => accu + parseFloat(current), 0)
            .toFixed(2)
        ),
        montantTotalTtcNonPayye: parseFloat(
          data
            .filter(
              (eleAnnu) =>
                eleAnnu.annuler !== 'Annuler' &&
                eleAnnu.agence === eleAcc &&
                eleAnnu.etat !== 'Payée'
            )
            .map((eleMTtc) => eleMTtc.montant_ttc)
            .reduce((accu, current) => accu + parseFloat(current), 0)
            .toFixed(2)
        ),
        montantTotalTtcRetenu: parseFloat(
          data
            .filter(
              (eleAnnu) =>
                eleAnnu.annuler !== 'Annuler' && eleAnnu.agence === eleAcc
            )
            .map((eleMTtc) => eleMTtc.montant_retenu)
            .reduce((accu, current) => accu + parseFloat(current), 0)
            .toFixed(2)
        ),
      };
      bigObj[ele]['All']['montantTotalTtc'] += parseFloat(
        bigObj[ele][eleAcc]['montantTotalTtc'].toFixed(2)
      );
      bigObj[ele]['All']['montantTotalTtcPayye'] += parseFloat(
        bigObj[ele][eleAcc]['montantTotalTtcPayye'].toFixed(2)
      );
      bigObj[ele]['All']['montantTotalTtcNonPayye'] += parseFloat(
        bigObj[ele][eleAcc]['montantTotalTtcNonPayye'].toFixed(2)
      );
      bigObj[ele]['All']['montantTotalTtcRetenu'] += parseFloat(
        bigObj[ele][eleAcc]['montantTotalTtcRetenu'].toFixed(2)
      );
      if (bigObj['All'].hasOwnProperty(eleAcc)) {
        bigObj['All'][eleAcc]['montantTotalTtc'] +=
          bigObj[ele][eleAcc]['montantTotalTtc'];
        bigObj['All'][eleAcc]['montantTotalTtcPayye'] +=
          bigObj[ele][eleAcc]['montantTotalTtcPayye'];
        bigObj['All'][eleAcc]['montantTotalTtcNonPayye'] +=
          bigObj[ele][eleAcc]['montantTotalTtcNonPayye'];
        bigObj['All'][eleAcc]['montantTotalTtcRetenu'] +=
          bigObj[ele][eleAcc]['montantTotalTtcRetenu'];
      } else {
        bigObj['All'][eleAcc] = { ...bigObj[ele][eleAcc] };
      }
      bigObj['All']['All']['montantTotalTtc'] +=
        bigObj[ele][eleAcc]['montantTotalTtc'];
      bigObj['All']['All']['montantTotalTtcPayye'] +=
        bigObj[ele][eleAcc]['montantTotalTtcPayye'];
      bigObj['All']['All']['montantTotalTtcNonPayye'] +=
        bigObj[ele][eleAcc]['montantTotalTtcNonPayye'];
      bigObj['All']['All']['montantTotalTtcRetenu'] +=
        bigObj[ele][eleAcc]['montantTotalTtcRetenu'];
    });
  });
  window.localStorage.setItem('bigObj', JSON.stringify(bigObj));
  montantTotal.textContent = `${bigObj['All']['All'][
    'montantTotalTtc'
  ].toFixed(2)} DA`;
  montantPayee.textContent = `${bigObj['All']['All'][
    'montantTotalTtcPayye'
  ].toFixed(2)} DA`;
  montantNonPayee.textContent = `${bigObj['All']['All'][
    'montantTotalTtcNonPayye'
  ].toFixed(2)} DA`;
  montantRetenu.textContent = `${bigObj['All']['All'][
    'montantTotalTtcRetenu'
  ].toFixed(2)} DA`;
}
RefreshBtn.addEventListener('click', getDataAndCalc);
getData();
