import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { IPaginacao } from '../../interfaces/IPaginacao';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import { Button, Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import http from '../../http';

interface IParametrosBusca {
  ordering?: string
  search?: string
}

const ListaRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState('');
  const [paginaAnterior, setPaginaAnterior] = useState('');
  const [busca, setBusca] = useState('');
  const [ordenador, setOrdenador] = useState('nome');

  const carregarDados = (url: string, opcoes: AxiosRequestConfig = {}) => {

    http.get<IPaginacao<IRestaurante>>(url, opcoes)
      .then(response => {
        setRestaurantes(response.data.results)
        setProximaPagina(response.data.next)
        setPaginaAnterior(response.data.previous)
      })
      .catch(erro => {
        console.log(erro)
      });
  }

  useEffect(() => {
    carregarDados('http://localhost:8000/api/v1/restaurantes/')
  }, []);

  function pesquisaRestaurantes(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const opcoes = {
      params: {} as IParametrosBusca
    }

    if(busca) {
      opcoes.params.search = busca
    }

    if(ordenador) {
      opcoes.params.ordering = ordenador
    }

    carregarDados('http://localhost:8000/api/v1/restaurantes/', opcoes);
  }

  return (
    <section className={style.ListaRestaurantes}>
      <div className={style.areaPesquisa}>
        <h1>Os restaurantes mais <em>bacanas</em>!</h1>

        <Box component='form' onSubmit={pesquisaRestaurantes} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <TextField id="input-with-sx" label="Pesquisar" variant="standard" onChange={event => setBusca(event.target.value)}/>
            <Button type='submit'>
              <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            </Button>
          </Box>
          <Box sx={{ minWidth: 120 }}>
            <FormControl variant="standard" fullWidth>
              <InputLabel>Ordenar</InputLabel>
              <Select
                value={ordenador}
                onChange={event => setOrdenador(event.target.value)}
                label="Ordenar"
              >
                <MenuItem value='id'>Id</MenuItem>
                <MenuItem value='nome'>Nome</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        
      </div>
      {
        restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)
      }
      {
        <button onClick={() => carregarDados(paginaAnterior)} disabled={!paginaAnterior}>
          Página Anterior
        </button>
      }
      {
        <button onClick={() => carregarDados(proximaPagina)} disabled={!proximaPagina}>
          Próxima página
        </button>
      }
    </section>
  )
}

export default ListaRestaurantes