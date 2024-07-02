import { useEffect, useState } from "react";
import IPrato from "../../../interfaces/IPrato";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Link } from "react-router-dom";
import http from "../../../http";

const AdministracaoPratos = () => {
    const [pratos, setPratos] = useState<IPrato[]>([]);

    useEffect(() => {
        http.get<IPrato[]>('pratos/')
            .then(response => {
                setPratos(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const excluir = (pratoAExcluir: IPrato) => {
        http.delete(`pratos/${pratoAExcluir.id}/`)
        .then(response => {
            alert('Prato excluído.');

            const listaPratos = pratos.filter(prato => prato.id !== pratoAExcluir.id);

            setPratos([...listaPratos]);
        })
        .catch(error => {
            console.log(error);
        })
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Nome
                        </TableCell>
                        <TableCell>
                            Tag
                        </TableCell>
                        <TableCell>
                            Imagem
                        </TableCell>
                        <TableCell>
                            Editar
                        </TableCell>
                        <TableCell>
                            Excluir
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        pratos.map(prato =>
                            <TableRow key={prato.id}>
                                <TableCell>
                                    { prato.nome }
                                </TableCell>
                                <TableCell>
                                    { prato.tag }
                                </TableCell>
                                <TableCell>
                                    [ <a href={prato.imagem } target="_blank" rel="noreferrer"> Ver imagem</a> ]
                                </TableCell>
                                <TableCell>
                                    [ <Link to={`/admin/pratos/${prato.id}`}>Editar</Link> ]
                                </TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="error" onClick={() => excluir(prato)}>
                                        Excluir
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default AdministracaoPratos;