"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Users,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  X,
  UserPlus,
} from "lucide-react";

export default function Pengguna() {
  const [search, setSearch] = useState("");

  const [filterStatus, setFilterStatus] =
    useState("Semua");

  const [showPassword, setShowPassword] =
    useState<string | null>(null);

  const [openDelete, setOpenDelete] =
    useState(false);

  const [selectedDelete, setSelectedDelete] =
    useState<any>(null);

  const [openTambah, setOpenTambah] =
    useState(false);

  const [openEdit, setOpenEdit] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState<any>(null);

  const [users, setUsers] = useState([
    {
      id: 1,
      nama: "Fahri Ramadhan",
      nisnip: "232410101",
      password: "fahri123",
      status: "Siswa",
      kelas: "XI RPL 1",
    },

    {
      id: 2,
      nama: "Nabila Putri",
      nisnip: "198812001",
      password: "nabila456",
      status: "Guru",
      kelas: "-",
    },

    {
      id: 3,
      nama: "Raka Prasetya",
      nisnip: "232410102",
      password: "rakaganteng",
      status: "Siswa",
      kelas: "XI TKJ 2",
    },
  ]);

  const [formData, setFormData] =
    useState({
      nama: "",
      nisnip: "",
      password: "",
      status: "Siswa",
      kelas: "",
    });

  const [editData, setEditData] =
    useState({
      id: 0,
      nama: "",
      nisnip: "",
      password: "",
      status: "Siswa",
      kelas: "",
    });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const cocokSearch =
        user.nama
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        user.nisnip.includes(search);

      const cocokStatus =
        filterStatus === "Semua" ||
        user.status === filterStatus;

      return (
        cocokSearch && cocokStatus
      );
    });
  }, [users, search, filterStatus]);

  const tambahUser = () => {
    if (
      !formData.nama ||
      !formData.nisnip ||
      !formData.password
    )
      return;

    const newUser = {
      id: Date.now(),
      ...formData,
    };

    setUsers([newUser, ...users]);

    setFormData({
      nama: "",
      nisnip: "",
      password: "",
      status: "Siswa",
      kelas: "",
    });

    setOpenTambah(false);
  };

  const editUser = () => {
    const updated = users.map((user) =>
      user.id === editData.id
        ? editData
        : user
    );

    setUsers(updated);

    setOpenEdit(false);
  };

  const hapusUser = (id: number) => {
    setUsers(
      users.filter((user) => user.id !== id)
    );

    setOpenDelete(false);
  };

  return (
    <>
      <div className="mx-auto flex h-[calc(100vh-120px)] w-full max-w-7xl flex-col lg:h-[calc(100vh-40px)]">

        <div className="mb-5 rounded-[32px] bg-gradient-to-r from-[#651A27] to-[#8D303C] p-7 text-white shadow-2xl">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h1 className="text-3xl font-bold tracking-wide text-white">
                Control Panel
              </h1>

              <p className="mt-2 text-sm text-white/80">
                Kelola data pengguna
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">

              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value
                  )
                }
                className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#651A27] outline-none"
              >
                <option>Semua</option>
                <option>Siswa</option>
                <option>Guru</option>
              </select>

              <button
                onClick={() =>
                  setOpenTambah(true)
                }
                className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#651A27] shadow-lg duration-300 hover:scale-[1.03]"
              >
                <UserPlus size={18} />
                Tambah Pengguna
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-full flex-col overflow-hidden rounded-[30px] border border-[#651A27]/10 bg-white shadow-2xl">

          <div className="border-b border-[#651A27]/10 px-6 py-5">

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#651A27]/10 text-[#651A27]">
                  <Users size={22} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black">
                    Kelola Pengguna
                  </h2>

                  <p className="text-sm text-gray-600">
                    Data akun pengguna
                    Temuin
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-[#651A27]/10 bg-[#FAF6F7] px-4 py-3">

                <Search
                  size={18}
                  className="text-[#651A27]"
                />

                <input
                  type="text"
                  placeholder="Cari pengguna..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  className="w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-500 sm:w-[250px]"
                />
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-6">

            <div className="overflow-auto rounded-3xl border border-[#651A27]/10">

              <table className="w-full min-w-[950px]">

                <thead className="bg-[#F7ECEE]">

                  <tr className="text-xs uppercase tracking-wide text-[#651A27]">

                    <th className="px-5 py-4 text-center">
                      Nama
                    </th>

                    <th className="px-5 py-4 text-center">
                      NIS / NIP
                    </th>

                    <th className="px-5 py-4 text-center">
                      Password
                    </th>

                    <th className="px-5 py-4 text-center">
                      Status
                    </th>

                    <th className="px-5 py-4 text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {filteredUsers.map((user) => (

                    <tr
                      key={user.id}
                      className="border-t border-[#651A27]/10 hover:bg-[#FFF7F8]"
                    >

                      <td className="px-5 py-5 text-center font-semibold text-black">
                        {user.nama}
                      </td>

                      <td className="px-5 py-5 text-center text-sm text-black">
                        {user.nisnip}
                      </td>

                      <td className="px-5 py-5">

                        <div className="flex items-center justify-center gap-3">

                          <span className="text-sm font-medium text-black">

                            {showPassword ===
                            user.nisnip
                              ? user.password
                              : "••••••••"}
                          </span>

                          <button
                            onClick={() =>
                              setShowPassword(
                                showPassword ===
                                  user.nisnip
                                  ? null
                                  : user.nisnip
                              )
                            }
                            className="text-[#651A27]"
                          >
                            {showPassword ===
                            user.nisnip ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="px-5 py-5">

                        <div className="flex justify-center">

                          <div
                            className={`rounded-full px-4 py-2 text-xs font-bold ${
                              user.status ===
                              "Guru"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {user.status}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5">

                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() => {
                              setSelectedUser(
                                user
                              );

                              setEditData(
                                user
                              );

                              setOpenEdit(
                                true
                              );
                            }}
                            className="rounded-xl bg-yellow-100 p-2 text-yellow-700 duration-300 hover:bg-yellow-500 hover:text-white"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedDelete(
                                user
                              );

                              setOpenDelete(
                                true
                              );
                            }}
                            className="rounded-xl bg-red-100 p-2 text-red-600 duration-300 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {openTambah && (

        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="relative w-full max-w-lg rounded-[35px] bg-white p-8 shadow-2xl">

            <button
              onClick={() =>
                setOpenTambah(false)
              }
              className="absolute right-5 top-5 rounded-full bg-[#651A27]/10 p-2 text-[#651A27]"
            >
              <X size={18} />
            </button>

            <h2 className="mb-7 text-2xl font-bold text-[#651A27]">
              Tambah Pengguna
            </h2>

            <div className="grid gap-4">

              <input
                type="text"
                placeholder="Nama"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nama:
                      e.target.value,
                  })
                }
                className="rounded-2xl border border-[#651A27]/15 bg-[#FAF6F7] px-4 py-3 text-sm text-black outline-none placeholder:text-gray-500"
              />

              <input
                type="text"
                placeholder="NIS / NIP"
                value={formData.nisnip}
                onChange={(e) => {
                  const onlyNumber =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );

                  setFormData({
                    ...formData,
                    nisnip:
                      onlyNumber,
                  });
                }}
                className="rounded-2xl border border-[#651A27]/15 bg-[#FAF6F7] px-4 py-3 text-sm text-black outline-none placeholder:text-gray-500"
              />

              <input
                type="text"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password:
                      e.target.value,
                  })
                }
                className="rounded-2xl border border-[#651A27]/15 bg-[#FAF6F7] px-4 py-3 text-sm text-black outline-none placeholder:text-gray-500"
              />

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status:
                      e.target.value,
                  })
                }
                className="rounded-2xl border border-[#651A27]/15 bg-[#FAF6F7] px-4 py-3 text-sm text-black outline-none"
              >
                <option>Siswa</option>
                <option>Guru</option>
              </select>

              <input
                type="text"
                placeholder="Kelas"
                value={formData.kelas}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    kelas:
                      e.target.value,
                  })
                }
                className="rounded-2xl border border-[#651A27]/15 bg-[#FAF6F7] px-4 py-3 text-sm text-black outline-none placeholder:text-gray-500"
              />

              <button
                onClick={tambahUser}
                className="rounded-2xl bg-[#651A27] py-3 text-sm font-semibold text-white shadow-lg"
              >
                Tambahkan Pengguna
              </button>
            </div>
          </div>
        </div>
      )}

      {openEdit && (

        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          <div className="relative w-full max-w-lg rounded-[35px] bg-white p-8 shadow-2xl">

            <button
              onClick={() =>
                setOpenEdit(false)
              }
              className="absolute right-5 top-5 rounded-full bg-[#651A27]/10 p-2 text-[#651A27]"
            >
              <X size={18} />
            </button>

            <h2 className="mb-7 text-2xl font-bold text-[#651A27]">
              Edit Pengguna
            </h2>

            <div className="grid gap-4">

              <input
                type="text"
                value={editData.nama}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    nama:
                      e.target.value,
                  })
                }
                className="rounded-2xl border border-[#651A27]/15 bg-[#FAF6F7] px-4 py-3 text-sm text-black outline-none"
              />

              <input
                type="text"
                value={editData.nisnip}
                onChange={(e) => {
                  const onlyNumber =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );

                  setEditData({
                    ...editData,
                    nisnip:
                      onlyNumber,
                  });
                }}
                className="rounded-2xl border border-[#651A27]/15 bg-[#FAF6F7] px-4 py-3 text-sm text-black outline-none"
              />

              <input
                type="text"
                value={editData.password}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    password:
                      e.target.value,
                  })
                }
                className="rounded-2xl border border-[#651A27]/15 bg-[#FAF6F7] px-4 py-3 text-sm text-black outline-none"
              />

              <select
                value={editData.status}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    status:
                      e.target.value,
                  })
                }
                className="rounded-2xl border border-[#651A27]/15 bg-[#FAF6F7] px-4 py-3 text-sm text-black outline-none"
              >
                <option>Siswa</option>
                <option>Guru</option>
              </select>

              <input
                type="text"
                value={editData.kelas}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    kelas:
                      e.target.value,
                  })
                }
                className="rounded-2xl border border-[#651A27]/15 bg-[#FAF6F7] px-4 py-3 text-sm text-black outline-none"
              />

              <button
                onClick={editUser}
                className="rounded-2xl bg-[#651A27] py-3 text-sm font-semibold text-white shadow-lg"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {openDelete &&
        selectedDelete && (

          <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-[35px] bg-white p-7 shadow-2xl">

              <h2 className="text-center text-2xl font-bold text-[#651A27]">
                Hapus Pengguna
              </h2>

              <p className="mt-4 text-center text-sm text-gray-700">
                Apakah anda yakin
                ingin menghapus akun
                pengguna ini?
              </p>

              <div className="mt-7 flex gap-3">

                <button
                  onClick={() =>
                    setOpenDelete(
                      false
                    )
                  }
                  className="w-full rounded-2xl bg-gray-200 py-3 text-sm font-semibold text-black duration-300 hover:bg-gray-300"
                >
                  Tidak
                </button>

                <button
                  onClick={() =>
                    hapusUser(
                      selectedDelete.id
                    )
                  }
                  className="w-full rounded-2xl bg-red-600 py-3 text-sm font-semibold text-white duration-300 hover:bg-red-700"
                >
                  Ya
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
}